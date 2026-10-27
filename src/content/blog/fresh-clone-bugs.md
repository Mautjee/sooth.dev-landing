---
title: "Three bugs a fresh clone found that code review didn't"
description: 'An FK ordering violation, a silent duplicate block write, and a frontend wire-format mismatch. All three passed review and all three died to a fresh clone.'
pubDate: 2026-10-22
tags: [debugging, postgres, zod, process]
project: aztecscan
---

Three bugs in one pull request, none found by reading the diff. They were found by cloning the repo
on a clean machine, pointing it at an empty database, and running the real ingestion path.

That is the whole thesis: some bugs are properties of the sequence and the state, not of the code
you can see in a diff. Code review reads the change. A fresh clone executes it.

## The setup

The system is an event-driven block explorer. Chain listeners publish events to Kafka, an API
service consumes them, and Postgres holds the result. There are 37 SQL migrations across five
environments, and the local database is one of them.

The work was landed in PR #364. Nothing about it was exotic; that is what makes it useful. Each of
the three bugs was locally reasonable and individually reviewable. Together they only appear when
the system runs from zero.

## Bug one: the foreign key that arrived second

The first symptom was a foreign-key violation during ingestion. Contract-instance data referenced a
contract class that had not been stored yet.

The code that wrote the instance was correct. The code that wrote the class was correct. The problem
was ordering: the two events arrive independently, and nothing guaranteed that the class event was
processed before the instance event that referenced it. On a database with existing rows, the class
was usually already there, so the bug stayed invisible. On an empty database, the first instance
could beat its class by milliseconds and the insert failed.

This is the classic shape of an ingestion-ordering bug. A reviewer sees two handlers and judges each
one. The failure lives in the contract between them, and the contract is "eventually, in some
order."

The fix is to make the dependency explicit. Either the consumer upserts the parent before the child,
or it buffers the child until the parent arrives, or it makes the foreign key deferrable and retries
the transaction. Which one is right depends on whether the parent event is guaranteed to exist at
all. In our case the class was guaranteed to exist eventually, so the correct fix was to ensure the
parent write happened first and to let a retry cover the race.

## Bug two: the block that was written twice

The second symptom was subtler. The fresh clone logged storing the same block twice.

The log line was the finding:

```text
Fresh clone logs storing block two times.
If it is a retry that is supposed to happen, then it should log so as well.
```

That sentence is the whole review. At-least-once delivery means a duplicate is normal. A duplicate
write that is not logged as a duplicate is not normal, because it makes retries invisible: the
system looks like it processed two blocks, and every downstream count is wrong.

On a long-lived database the duplicate usually died against a unique constraint, or the second write
overwrote the first with identical values and nobody noticed. On an empty database with a fresh
consumer group, the retry happened immediately and the log made the double write visible.

The fix has two parts. Make the write idempotent with a unique key on the block identity and an
`ON CONFLICT DO NOTHING`, and log the conflict. The second part matters as much as the first: a
retry that succeeds silently is a retry you cannot count, and counting retries is how you learn
whether your consumer is healthy.

```sql
-- simplified: the shape of the fix
INSERT INTO blocks (height, hash, parent_hash, timestamp)
VALUES ($1, $2, $3, $4)
ON CONFLICT (height, hash) DO NOTHING;
```

If the insert affects zero rows, that is a duplicate. Log it as a duplicate, increment a counter,
and move on. Do not let it look like a normal write.

## Bug three: the wire format changed under the schema

The third bug was a runtime type error, not a database error:

```text
ZodError: expected object, received array
  at body.txEffects[0].contractClassLogs
```

The frontend validates API responses with a Zod schema at runtime. The protocol had shipped a new
version, and one field that used to be an object now arrived as an array. TypeScript was happy,
because the types are generated from the SDK and the SDK version was updated. The running system was
not, because the frontend's runtime schema still described the old shape.

This is the most interesting of the three, because no amount of review would have caught it. The
diff was correct against the new types. The failure exists at the boundary between a generated type
and a hand-written runtime validator, and those two things version independently.

The fix is to normalise at the boundary rather than to trust either side. Accept both shapes in the
schema, convert to one internal representation, and make the validator the single place that knows
about the difference.

```ts
// simplified: accept both shapes at the boundary
const ContractClassLogs = z.union([
  z.array(ContractClassLogSchema),
  ContractClassLogSchema.transform((one) => [one]),
]);
```

The longer-term fix is to test the validator against a recorded response from the new protocol
version. A schema that has never seen a real payload is a schema that documents an assumption.

## Why code review missed all three

Each bug was a property of something review does not see:

- Ordering between two handlers, which is a runtime sequence.
- Idempotency under retry, which is a property of the delivery guarantee.
- A wire format crossing a version boundary, which is a property of two artifacts versioning apart.

Review reads a diff in isolation. All three bugs needed the system to run from zero, with an empty
database and a fresh consumer group, to become visible.

## What it cost

The obvious cost is the bugs themselves. The less obvious cost is that this codebase had 13 test
files across roughly 80,000 lines of TypeScript, and its lint step in the PR workflow was commented
out. That is a fast-moving-protocol tradeoff, and it is the reason a manual fresh-clone run was doing
work that a test suite should have done.

A fresh-clone check is not free either. It takes a clean database, a running broker, seeded chain
data, and enough patience to read the logs rather than just the exit code. In this case it was worth
an hour because it found three bugs that would each have been expensive in a different environment.

## What I'd do differently

I would turn the fresh-clone run into a command in CI, not a thing a person remembers to do. The
command would create an empty database, start the dependencies, run the ingestion path against a
recorded fixture, and assert three things: no foreign-key errors, no unlogged duplicate writes, and
every API response validates against the frontend's schema.

I would also make duplicate writes a first-class metric. The log line was the entire finding, which
means the information existed and was not being watched. A counter on retries and conflicts would
have surfaced it before someone happened to read the log.

## What to steal

- Run the system from zero before you trust it. A fresh clone is a test case.
- Treat event ordering as a contract, not an accident.
- Make writes idempotent and log the idempotent path. Silent success is a bug in observability.
- Validate at every wire boundary, and test the validator against a real payload.
- If a bug needs state to reproduce, it needs a test that creates that state.

## Artefact

The three symptoms, in the order the fresh clone produced them. These are the error lines and the log
that turned each one into a fix:

```text
1. foreign key violation
   insert contract_instance -> contract_class_id not present
   cause: class event had not been consumed yet

2. duplicate write
   "Fresh clone logs storing block two times. If it is a retry that is
    supposed to happen, then it should log so as well."

3. runtime schema mismatch
   ZodError: expected object, received array
     at body.txEffects[0].contractClassLogs
   cause: protocol version changed the field from object to array
```

None of those messages names a line in the diff. Each one names a state the system was in, which is
why the fresh clone found them and review did not.

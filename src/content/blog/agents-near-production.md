---
title: "What an AI agent needs before you let it near production"
description: 'An agent needs the codebase conventions in writing, one governed path to the data, and a human gate before anything irreversible. Evidence from two projects.'
pubDate: 2026-09-05
tags: [ai-agents, platform, mcp, guardrails]
project: okutama
---

In 2026 the interesting problem isn't "can an agent write code." It's what an agent needs so it can
be trusted near production, and what guardrails stop it destroying something.

I've answered that twice, in two projects, with commits behind both. The answers were not "a better
model" or "a longer prompt." They were: give it the conventions in writing, give it one governed
path to the data, and keep a human gate in front of anything irreversible.

## 1. Give it the codebase's conventions in writing

An agent dropped into a repository has no memory of why the code looks the way it does. You cannot
expect it to re-derive a year of unwritten tribal knowledge from the diff. At Aztecscan I wrote
that knowledge down.

The core artifact was `.opencode/agents/devops.md`: 296 lines, two commits, both mine, describing
this repo's Kafka conventions, its React patterns, and its release process. Alongside it, PR #612
added six skill guides and six agent personas, about 2,055 lines total, including how to add a
Kafka topic end to end through `message-registry` and `message-bus`.

The rules were specific on purpose. "Use the shared message registry" is a convention an agent can
follow; "write idiomatic code" is not. The test of whether the writing worked is whether an agent
could make a change that a reviewer would accept without re-explaining the architecture in review.

The second half was wiring review into the same loop. `.github/workflows/claude.yml` (four commits,
all mine) connected `@claude` mentions to a review action. I used it on my own PR #525, and it
returned a structured review quoting specific line ranges. I also delegated my own review feedback
to Copilot's autonomous coding agent on PRs #540 and #622. On #540 that meant replacing a full-table
scan with an `inArray(...)` pushed into SQL and collapsing an N+1 into one batched query. Then I
asked it to verify its own changes against the commits before I accepted them.

That last step is the one people skip. Delegating a fix is not the same as accepting it. An agent
that says it fixed something is making a claim, and the claim needs the same check as any other.

## 2. Give it a governed data path instead of ad hoc access

Conventions get an agent to a correct diff. They do not decide what it is allowed to read or write.

At The Grid, the situation before the MCP server was the common one: agents and tools had no
standard, safe path to company data. Reads were anonymous, writes routed through bespoke code, and
external clients could not connect at all. An agent that wanted to answer a question had to be given
a pile of endpoints and hoped to use them correctly.

The fix, PRs #495 to #502, was a **Grid MCP Server**: one MCP server, UPS-authenticated, delegating
every read and write to the backend. Instead of knowing a dozen endpoints, an agent knows one, and
that one enforces who can read what and who can change what.

The design decisions that mattered were not the MCP protocol itself:

- **Stateless streamable HTTP.** No session state between requests, so a pod restart is boring and
  horizontal scaling is not a design problem. We added a SIGTERM drain test to prove it.
- **A fail-closed auth chain.** Credential exchange, JWKS verification, token cache, middleware,
  each in its own file. The convention was written into the code review: throw on any non-200 and
  never fall back to the input credential, because a fallback silently downgrades the caller to
  unauthenticated.
- **A bounded mint route.** The service-token mint route is rate limited at 5 requests per second
  with a burst of 10 and a 10-minute idle TTL. A healthy caller mints only when its token nears
  expiry, so the limit is generous for real traffic and hostile to brute force.
- **Bounded outbound calls.** Every call has a five-second default timeout. A `http.Client{}` with no
  timeout is an outage waiting for a slow dependency.

There was also a constraint I did not expect, and it is the detail that makes the work feel real.
The Anthropic API rejects a top-level `anyOf`, `oneOf` or `allOf` in a tool's JSON schema. We wanted
a tool rule that said "at least one of name, type or status." It could not live at the top level of
the schema, so the handler enforces it and the schema only describes it to the model. A validation
rule that exists in code but not in the contract is a rule the model can violate and the server will
reject, which is the correct failure direction, but it is worth knowing you signed up for it.

## 3. Keep a human gate in front of the irreversible

Neither of the first two helps if the agent can quietly delete something it cannot restore.

The gate does not have to be dramatic. On this platform, production deployments went through ArgoCD
with a manual sync gate while staging auto-synced. An agent could propose and prepare a production
change; a human still pressed the button. That is a small amount of friction in exchange for a class
of incident that does not happen.

I have also worked inside a stronger version of the same idea, where a playbook against a mainnet
host required typing the exact hostname back before it would run. That one is not my code, and I am
describing it as a pattern I have seen work rather than something I built. The principle is the same
at both scales: the irreversible step asks a person to mean it.

## What this cost

The honest part. Writing 2,000 lines of agent documentation is real work, and it decays. Every new
service, every renamed package, every changed release step is a place where the document becomes a
lie that the agent will confidently follow. Somebody has to own it, and the review process has to
treat a stale convention file as a bug.

Two AI review paths also produce noise. A reviewer bot that comments on 72 of 73 files is not free;
it costs attention, and attention is the scarce thing in review. The useful configuration was the
one where the agent had enough context to be specific and I still read every comment before
accepting it.

And delegation has a failure mode that looks like success: the agent reports that it fixed the
review, the diff looks plausible, and nobody re-runs the check. I made self-verification part of
the instruction every time, which is a process fix, not a model fix.

## What I'd do differently

I would version the agent guidance with the code and give it an owner, rather than treating it as a
one-time onboarding document. I would also start with one shared convention file and let services
add their own, instead of writing the full library up front. The library was valuable once it
existed; the first version tried to describe everything before the conventions had settled.

## What to steal

- Write the conventions down where the agent can read them, and keep them current.
- Give the agent one authenticated path to data, with the rules enforced server-side.
- Never let a tool's validation live only in the prompt.
- Keep a human gate on the operation you cannot undo.
- Make the agent verify its own fix, and verify the verification.

## Artefact

Simplified from the MCP server's layout. Each auth step is a separate file so the chain can be read
in order, and the tools are one file each:

```text
cmd/grid-mcp-server/
  main.go                  # stateless HTTP, SIGTERM drain, bind error not os.Exit
  auth/
    exchange.go            # UPS credential exchange
    jwks.go                # JWKS fetch + cache + refetch on unknown kid
    cache.go               # token cache with expiry margin
    middleware.go          # verify, then attach identity; never fall through
  tools/
    tool_find.go
    tool_query.go
    tool_tgs.go
  query/
    builder.go             # tool call -> DDN GraphQL
```

The rule I would put on a slide is in `auth/middleware.go`: on a non-200 from the identity service,
return the error. Do not continue with the credential that was passed in.

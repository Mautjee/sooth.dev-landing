---
title: 'Documentation drift, caught by audit'
description: 'My docs said our production nodes were one size and one cloud; reality differed in four details. The fixing commit says "correct stale cluster facts."'
pubDate: 2026-09-07
tags: [documentation, aws, kubernetes]
project: okutama
---

I trusted my own architecture docs once, against money. The docs were wrong in four separate ways.

The architecture overview said:

| The doc said | The account said |
|---|---|
| production runs `t3.medium` | `t3.large` |
| staging is Hetzner-hosted | AWS EC2 |
| those staging nodes are `t3.xlarge` | `t3.2xlarge` |
| ADR-0002 uses "pgx + Tern migrations" | a hand-rolled migration runner; Tern is not in the repo |

None of that is a disaster on its own. Together they are a warning: the document I reached for
before making a decision with real money on it had drifted so far from the live account that every
infrastructure-size assumption in it was wrong.

## How it surfaced

Not from a doc-refresh habit. From a decision record.

AWS Health flagged that the production cluster's Kubernetes version was leaving standard support.
Writing the decision record meant pricing the options, and pricing the options meant knowing what
the cluster actually was. I opened the architecture doc, then opened the account, and found they
disagreed on nearly every line.

The commit that fixed the docs is literally titled **"correct stale cluster facts."** That title is
the most honest artifact in the whole repo, because it admits the doc had been wrong for long
enough that nobody remembered which line was true.

## Why docs drift

A document is a snapshot of an opinion at a point in time. A cluster is a running system that
changes through the console, through CLI commands, through a pull request someone else merged, and
through whatever the cloud provider decided to do in the background. Nothing fails when the two
diverge. There is no test that turns red when a doc lies.

The specific mechanisms here were mundane:

- A node group was resized when traffic changed, and the architecture page was not part of that
  pull request.
- Staging moved from one provider to another during bring-up. The doc kept the old provider name
  because that was the plan when it was written.
- An ADR named a migration tool that was evaluated and then replaced by a hand-rolled runner.
  Nobody went back to the ADR, because the code was the source of truth for the people writing code.

The last one is the interesting failure. An ADR is supposed to be the durable record of a decision,
and ours described a tool that was not in the dependency graph. A reader who trusted it would have
been wrong about how migrations work, and would have had no reason to check.

There was a second consequence, and it changed the decision itself. Once the live versions were on
the page, it was obvious that some of the cluster's controllers were already outside the supported
range for the version we were running. The upgrade could not start with the control plane, because
the things it would break were already unsupported. The order had to be controllers first, then
the control plane, with a verification step in between. That is exactly the kind of fact a stale
document hides: not a wrong number, but a sequencing constraint that only exists in the live state.

## What an audit actually looks like

The audit was not a documentation project. It was a short list of questions, each answered against
the live system rather than against another document:

1. What instance type are the production nodes?
2. How many nodes, and what is the autoscaling range?
3. Which cloud and which region is staging in?
4. Which migration tooling is imported in the service that runs migrations?
5. Do the add-on versions match what the doc claims?

Every answer came from the account or the repository, not from the architecture page. The page was
then rewritten to match, with the date of verification in the commit message.

## What it cost

A few hours of checking, and the uncomfortable realisation that a decision I was about to defend had
been reasoned from a system that did not exist.

The more expensive version of this mistake is the one that did not happen. If I had sized the
replacement nodes from `t3.medium`, the plan would have looked internally consistent and would have
been wrong by a full instance class. Sizing is one of the few places where a documentation error
converts directly into either money or capacity, and it converts quietly.

## What I'd do differently

I would treat every claim about live infrastructure as a claim with an expiry date. Not a general
"keep docs updated" resolution, which nobody follows, but a concrete rule: a table that describes
the running platform carries the date it was last checked and the command that checked it. If the
date is older than the decision you are making, run the command again.

The second change is to put the verification step in the runbook, not in my memory. Before pricing a
cluster decision, the step is "query the account, paste the output into the decision record." That
turns a habit into a checklist item, and a checklist item survives a busy week.

## What to steal

- Don't trust your own architecture docs when a decision has money on it. Re-verify against the
  account.
- Date every claim about a live system, and record the command that proves it.
- An ADR can drift too. If the code imports something else, the ADR is wrong.
- When you find drift, fix the document in the same change that proves the new facts. The commit
  message is the audit trail.

A decision powered by stale facts isn't really the decision you think you're making. You're
optimizing a system that stopped existing shortly after the doc was last updated, in ways nobody
noticed. The gap between `t3.medium` and `t3.large` looks small until you scale a decision off it.

## Artefact

The audit result, in the shape it went into the decision record. This is the before-and-after that
produced the "correct stale cluster facts" commit:

```text
docs/architecture/overview.md — before             → verified against the live account

production node group   t3.medium                 → t3.large
production node count   not stated                → 2–4 nodes
staging host            Hetzner, t3.xlarge        → AWS EC2, t3.2xlarge
migrations              pgx + Tern (ADR-0002)     → hand-rolled runner, internal/database/migrations.go
```

The check itself was not clever. Read the claim, query the thing, write down both. The discipline is
in refusing to accept the document as the answer.

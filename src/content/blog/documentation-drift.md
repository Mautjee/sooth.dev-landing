---
title: 'Documentation drift, caught by audit'
description: 'My architecture docs said our production nodes were one size and one cloud; reality was different in all four details. The commit that fixed it is literally titled "correct stale cluster facts."'
pubDate: 2026-09-07
tags: [documentation, aws, kubernetes]
project: okutama
---

I trusted my own architecture docs once, against money. The docs were wrong in four separate
ways.

The architecture overview said:

- production runs `t3.medium` → reality: `t3.large`
- staging is Hetzner-hosted → reality: AWS EC2
- those nodes are `t3.xlarge` → reality: `t3.2xlarge`
- ADR-0002 says we use "pgx + Tern migrations" → reality: a hand-rolled migration runner. Tern
  isn't anywhere in the repo.

None of that is a disaster on its own. Together they're a warning: the document I'd reach for
before making a decision **with real money on it** had drifted so far from the live account that
every infrastructure-size assumption in it was wrong.

## How it got fixed

Not by a doc-refresh habit — by an audit. While writing a decision record, I re-verified every
live-AWS claim in the docs against the actual account and cluster before trusting it. And I
found exactly that: an EKS node pool sized for traffic that had moved since the doc was written.

The commit that fixes it is literally titled **"correct stale cluster facts."**

## The lesson

**Don't trust your own architecture docs when a decision has money on it — re-verify against the
live account.**

A decision powered by stale facts isn't really the decision you think you're making. You're
optimizing a system that stopped existing at some point shortly after the doc was last updated,
in ways nobody noticed. The `t3.medium` vs `t3.large` gap looks small until you scale a
decision off it.

Two habits fix this: a runbook step that reads the docs *and* the live state before
sizing anything, and a willingness to update the doc the moment the cluster drifts — not
"later." The doc is a contract; if nobody enforces it, it lies to everyone, yourself included.
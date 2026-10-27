---
title: 'Parallel-run, don''t cut over'
description: 'Four migrations where the old path stayed live until the new one was proven, and why the deprecated manifests still in the repo are the proof.'
pubDate: 2026-09-01
tags: [kubernetes, infra, migration]
project: okutama
---

Most people *say* they do parallel-run migrations. You can tell the ones who actually do: months
later, the old stuff is still sitting in the repo.

I have four of those artifacts now. Each one is a migration where the old path stayed live after
the new one started serving, and each one has a physical trace: a `-deprecated` manifest set, a
deleted controller, or a date in the git log that is later than the cutover.

## The ten-week gap

At [The Grid](/projects/okutama) we migrated ingress from nginx to the Gateway API with Envoy
Gateway. We did it one environment at a time: local and staging first in PR #13, production ten days
later in PR #38, after staging had carried real traffic.

The interesting number is what happened after. The old nginx ingress stayed installed for roughly
**ten more weeks** after the Envoy cutover before someone removed the dead definitions. That was not
an oversight. The old path was the rollback we could not lose.

Ten weeks is long enough that a reader should ask what it cost. It cost two ingress stacks to
understand, two sets of TLS and routing configuration to keep consistent, and a period where
debugging started with "which controller is answering this request?" That is the price of a rollback
that requires no rebuild.

## The `-deprecated` directories

The same project kept the old deployment topologies around as `-deprecated` manifest sets while
services moved onto the new pipeline. Those folders were still present months later. They are the
physical proof that the cutover was never a single switch.

I like this pattern because it makes the migration legible to someone who was not there. A new
engineer can open the repo and see that both paths existed, which one is current, and roughly when
the change happened. A deleted directory would have hidden all of it.

## Service-by-service, twice

At [Aztecscan](/projects/aztecscan) the CI/CD migration was even more granular. We moved from
Skaffold to GitHub Actions and Kustomize one **service** at a time, with `explorer-ui-v2` as the
live pilot while the old pipeline kept deploying the other seven. At the same project the ingress
move to Envoy Gateway went one **network** at a time: devnet, testnet and mainnet ran independent
protocol versions, so a single cutover would have meant doing the riskiest change three times at
once.

## The cluster upgrade

The fourth one is the least visible and the most important. When the production cluster's Kubernetes
version left standard support, the obvious move was to upgrade it. The audit found that some
controllers were already outside the supported range for the version we were running. Upgrading the
control plane first would have moved it further away from the things it needed to support.

So the sequence became: upgrade the blocking controllers, verify, then move one minor version,
verify, then move again. That is parallel-running at the version level. The old and new control
planes do not coexist, but the old behaviour is preserved long enough to compare against, and the
rollback story is a known version rather than a rebuild.

## What parallel-run actually requires

It is not enough to keep the old configuration in a branch. The old path has to be:

1. **Reachable.** If you cannot route a request to it, it is not a rollback.
2. **Funded.** It needs its certificates, secrets and monitoring while it waits. A path that decays
   is not a rollback either.
3. **Comparable.** You need a way to tell whether the new path is behaving. In the ingress case that
   was two controllers with overlapping logs; in the CI case it was two pipelines deploying
   different services and a diff of the rendered manifests.
4. **Owned.** Someone has to be responsible for deleting it. This is the part that fails most often.

## What it cost

Running two paths doubles the operational surface for the duration. Alerts have to be checked against
both. A configuration change has to be made twice or deliberately not made. There is a real period
where the team's mental model is "the new thing, except for the parts that are still the old thing,"
and that is uncomfortable.

The cost is worth it when the migration is load-bearing and the failure mode is an outage. It is not
worth it for a two-service prototype, where the old path is cheaper to rebuild than to maintain.

## What I'd do differently

I would put a deletion date on the old path at the moment of cutover, not after. The ten-week gap was
fine; the fact that nobody had written down when it would end was not. A `TODO` with a date and an
owner turns "we'll remove it later" into a task. Without one, the deprecated path becomes permanent
infrastructure with no owner, and the next audit finds it years later.

The second change: make the comparison explicit. We kept both paths and used the old one as a
reference, but we did not write down what "proven" meant before deleting it. A short list of signals
(new path serving for N days, no error increase, one representative client migrated) would have made
the deletion a decision rather than a feeling.

## What to steal

- Cut over small units: a service, a network, an environment. Never a platform.
- Keep the old path reachable, funded and monitored until the new one is proven.
- Write down what "proven" means before you start.
- Put a date and an owner on deleting the old path.
- Expect the migration to cost months of dual maintenance. Say that out loud before you begin.

## Artefact

The production ingress cutover, as a sequence with the gaps that made it safe:

```text
PR #13  local + staging   -> Envoy Gateway serves
        |  10 days
PR #38  production        -> Envoy Gateway serves
        |  ~10 weeks
        +--> dead nginx definitions removed
```

Four shipped migrations and one proposal, as a timeline. The last column is the point: the old path
outlived the cutover by weeks or months.

| Migration | Cutover unit | Cutover | Old path removed |
|---|---|---|---|
| Aztecscan: Skaffold → Actions + Kustomize | one service, `explorer-ui-v2` pilot | progressive | old pipeline kept deploying the remaining services |
| Aztecscan: nginx → Envoy Gateway | one network (devnet, testnet, mainnet) | progressive | in progress when I left |
| The Grid: nginx-ingress → Envoy Gateway | one environment (local+staging, then production) | PR #13, then PR #38 ten days later | ~10 weeks after production cutover |
| The Grid: old deployment topologies | one service at a time | PR #17 onward | `-deprecated` manifest sets still present |
| The Grid: EKS 1.33 → 1.35 | one minor version at a time | **proposed**, not executed: controllers first, then 1.34, then 1.35 | **proposed** sign-off: retire each version after verification |

If you cannot fill in the last column for your own migration, you have not finished planning it.

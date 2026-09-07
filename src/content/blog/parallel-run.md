---
title: 'Parallel-run, don''t cut over'
description: 'Four real migrations where I kept the old path running until the new one was proven — and why the artifacts still in the repo are the proof.'
pubDate: 2026-09-01
tags: [kubernetes, infra, migration]
project: okutama
---

Most people *say* they do parallel-run migrations. You can tell the ones who actually do:
months later, the old stuff is still sitting in the repo.

Two of my migrations left that exact evidence behind.

## The ten-week gap

At [The Grid](/projects/okutama) we migrated ingress from nginx to the Gateway API /
Envoy Gateway. We did it one **environment** at a time — local + staging first, then
production about ten days later. But the old nginx ingress stayed in production for roughly
**ten more weeks** after the Envoy cutover before someone finally deleted it.

That's not a bug. That's the point. The old path is the rollback you can't lose.

## The `-deprecated` directories

The same project kept old deployment topologies around as `-deprecated` manifest sets as we
moved the services onto the new pipeline. Again — those folders were still present months
later. They're the physical proof that we never did a big-bang cutover.

## Cutting over service-by-service

At [Aztecscan](/projects/aztecscan) the CI/CD migration was even more granular. We moved from
Skaffold to GitHub Actions + Kustomize one **service** at a time, with `explorer-ui-v2` as a
live pilot while the old pipeline kept deploying the other seven.

## The Kustomize footgun

On a related migration the payoff was a particularly good lesson about parallel-running with
tooling that has sharp edges: Kustomize's `nameSuffix` rewrites `metadata.name`, but it does
**not** rewrite `HTTPRoute.backendRefs[].name`. Traffic silently started routing to a service
that no longer existed. Renaming one thing while relying on references to it is a preview of
exactly what "cut over everything at once" feels like at scale.

## The takeaway

Cutting over everything at once turns a migration into a switch with a binary outcome. Running
the old path alongside the new one for a while costs a little extra operational surface and
buys you a working rollback, a comparison baseline, and time to find the footguns.

---
title: "Rewriting CI/CD service-by-service, without a freeze"
description: 'We moved Aztecscan off Skaffold onto GitHub Actions + Kustomize one service at a time — and the Kustomize footgun that nearly broke traffic silently is the part worth remembering.'
pubDate: 2026-09-06
tags: [ci-cd, kubernetes, kustomize]
project: aztecscan
---

Most teams migrate CI/CD the way they migrate everything else: an all-weekend freeze, one giant
PR that changes everything at once, and a switch with a binary outcome. At Aztecscan we did the
opposite — moved **one service at a time** onto the new pipeline, with `explorer-ui-v2` as the
live pilot while the old pipeline kept deploying the other seven.

## The incremental-unit question

The design question in any migration is *what's the smallest thing you can cut over
independently?* Here it was the service. Each app got its own GitHub Actions workflow, its own
Kustomize overlay, its own deploy. The old Skaffold pipeline stayed green, deploying the
remaining services, until — one by one — there was nothing left for it to do.

The reason this matters isn't aesthetics. When one service cut over and something went wrong,
the blast radius was one service. You could diff the new path against the old for the same app
and see exactly what differed. You never had to answer "is it nginx or is it the new pipeline?"

## The footgun that would have eaten us

This is the part worth writing down, because it's the kind of bug that works silently until it
isn't.

Kustomize's `nameSuffix` transform rewrites `metadata.name` on your resources — but it does
**not** rewrite `HTTPRoute.backendRefs[].name`. So the moment you let `nameSuffix` add a value
to your services, any `HTTPRoute` pointing at them references a name that no longer exists.

Traffic doesn't error loudly. It silently routes to a service that isn't there.

Because we were doing one service at a time, the mismatch surfaced on one route, in a pilot,
with the old path still available as a reference. That's the argument for incremental migration
in one sentence: the footgun that a big-bang cutover would have shipped to every service at once
was caught on one.

## What I'd keep

- **A live pilot that isn't load-bearing yet** — it proves the pipeline end to end before it
  matters.
- **The old path left running** until parity is proven, then deleted deliberately.
- **Treating `nameSuffix`/rename transforms as hostile to un-rewritten references** — after
  this, "does anything reference the old name" became a step in every Kustomize review.

Cut over service by service. Leave the old path up. And assume your rename transform didn't
update every reference, because sometimes it silently didn't.
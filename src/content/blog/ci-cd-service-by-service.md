---
title: "Rewriting CI/CD service-by-service, without a freeze"
description: 'Moving a nine-service platform from Skaffold to GitHub Actions and Kustomize one service at a time, plus the Kustomize footgun that broke traffic silently.'
pubDate: 2026-09-06
tags: [ci-cd, kubernetes, kustomize]
project: aztecscan
---

Most teams migrate CI/CD the way they migrate everything else: a freeze, one giant pull request, and
a switch with a binary outcome. At Aztecscan we did the opposite. We moved one service at a time
onto the new pipeline, with `explorer-ui-v2` as the live pilot while the old pipeline kept deploying
the other seven.

The change was not cosmetic. Before, we had flat Skaffold configs under

```text
k8s/production/<service>/<network>/
```

driven by shell scripts that rebuilt every service on every push. There was no Docker layer cache
and no shared base image in the parts that mattered. A change to one frontend paid for a rebuild of
the indexer.

After, each service owned its own deployment directory:

```text
services/<service>/k8s/
  base/
  overlays/
    mainnet/
    testnet/
    devnet/
```

Each service got one path-filtered GitHub Actions workflow, and the deploy step became
`kubectl apply -k` against the right overlay. Build and deploy were separated, `workflow_dispatch`
existed for a manual redeploy, and images went to the registry with GHA layer caching.

## The incremental unit is the design question

Every migration has a question underneath it: what is the smallest thing you can cut over
independently? If the answer is "the platform", you are doing a big-bang migration with extra
steps. If the answer is "one service", you can reason about blast radius.

Here, the service was genuinely independent. Each had its own Dockerfile, its own manifests, and
its own deploy. The old Skaffold pipeline could keep deploying the remaining services while one
service ran on the new path. When something broke, we could diff the two pipelines for the same
application and see exactly what differed.

`explorer-ui-v2` was the pilot because it was new: the team was rewriting the UI anyway, so the
pipeline change had a product reason to be there. It proved the workflow end to end on something
that was not yet load-bearing, and then the pattern was copied to the other seven services.

The per-service workflow also derived its target network from the pushed branch:
`production` to mainnet, `production-testnet` to testnet, `production-devnet` to devnet. That is a
small piece of logic, but it removed a whole class of "deployed the right image to the wrong
network" mistakes.

## The footgun that would have eaten us

This is the part worth writing down, because it works silently until it doesn't.

Kustomize's `nameSuffix` transform rewrites `metadata.name` on your resources. It does **not**
rewrite `HTTPRoute.spec.rules[].backendRefs[].name`. So the moment you let `nameSuffix` add a value
to your services, any HTTPRoute pointing at them references a name that no longer exists.

Traffic does not error loudly. It routes to a service that isn't there.

That is not a theoretical warning. Here is the smallest reproduction, built with `kustomize v5.4.3`:
an overlay adds `nameSuffix: -v2` to a base containing a Service and an HTTPRoute that both use the
name `explorer-api`.

```yaml
  # overlay/kustomization.yaml
resources:
  - ../base
nameSuffix: -v2
```

```console
$ kustomize build overlay
apiVersion: v1
kind: Service
metadata:
  name: explorer-api-v2
spec:
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: explorer-api
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: explorer-api-v2
spec:
  rules:
  - backendRefs:
    - name: explorer-api      # not rewritten
      port: 80
    matches:
    - path:
        type: PathPrefix
        value: /api
```

The route applies cleanly. The Service it points at is called `explorer-api-v2`. Nothing in the
manifest is invalid, so a schema check passes and `kubectl apply` is happy.

The practical rule: after any rename transform, grep the rendered output for the old name. Not the
source, the rendered output. `kustomize build` is the only place the mismatch is visible.

Because we were migrating one service at a time, the mismatch surfaced on one route, in a pilot,
with the old path still available as a reference. That is the argument for incremental migration in
one sentence: the footgun a big-bang cutover would have shipped to every service at once was caught
on one.

## The second footgun

The other lesson was less dramatic and more annoying. The new Dockerfiles used a `.dockerignore`
pattern that denied everything by default and allowlisted what a build needed. That is a good
pattern right up until a service needs one more file.

The documented failure mode was a build dying with:

```text
Cannot read file '.../tsconfig.json'
```

The file existed. It was simply not allowlisted, and the error points at the missing copy, not at
the ignore rule. Every new service had to remember to un-ignore every extension its build touched.
We wrote it into the migration doc after it bit, which is the same "documenting the system after it
works" mistake described below.

## What it cost

The migration took months, and for those months we carried two deployment systems. A debugging
session started with "which pipeline built this image?" A change to shared infrastructure had to be
made twice or deliberately not made. Two sets of manifests described the same services.

That is the real price of not freezing. You trade a weekend of risk for a season of duplicated
operational surface. It is worth it when the platform is load-bearing, and it is not worth it for a
two-service prototype.

## What I'd do differently

I would write the invariant checklist before the first service, not after the second incident. The
checklist is short: after a rename transform, grep the rendered output for the old name; after
adding a service, prove the build context can see every file it copies; before deleting the old
pipeline, write the date on which it gets deleted. Three lines that would have saved two debugging
sessions and one argument about whether the old path was still needed.

The second thing: the migration document was 459 lines and genuinely useful. It was also written
after the migration. A shorter document written before, with the open questions listed, would have
been more valuable to the person executing the tenth service.

## What to steal

- Pick a migration unit that has real independence, and make the old path keep working for
  everything else.
- Use a new feature as the pilot, not the most critical one.
- Render the manifests and grep the rendered output. Source-level review misses name mismatches.
- Separate build from deploy in the workflow, so a redeploy does not rebuild.
- Put a deletion date on the old path before you start, or it will outlive the migration.

Cut over service by service. Leave the old path up. And assume your rename transform did not update
every reference, because sometimes it silently didn't.

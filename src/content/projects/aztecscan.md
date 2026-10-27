---
title: 'Aztecscan'
role: 'Infrastructure & Full-stack Engineer'
period: 'Sep 2024 – Jun 2026'
repo: 'https://github.com/aztec-scan/chicmoz'
live: ''
stack: [TypeScript, Go, Kafka, Postgres, Kubernetes, Envoy Gateway, GitHub Actions]
status: 'completed'
summary: 'Block explorer for the Aztec privacy L2. Owned per-service CI/CD and production Kubernetes manifests across three live networks.'
featured: true
order: 1
tags: [blockchain, kubernetes, infrastructure]
---

## The problem

Aztec is a privacy-focused L2 on Ethereum, and a block explorer for it has to show state that the
chain deliberately hides. That alone is a data-modelling problem. The harder constraint was that
Aztec itself was not version-stable: wire formats, contract artifacts and database schema moved
underneath the explorer for the entire two years I worked on it.

The explorer had to serve five environments (local, staging, and three live networks) while those
networks ran different protocol versions on purpose.

## My role and what I owned

I was the second engineer on the project, joining about a month after the repo started and staying
for 21 months. I wrote **678 of 1,812 commits** (roughly 37%) and **133 authored pull requests, 128
merged**. I was not the project lead: Filip Harald started the repo and remains its largest
contributor at around 1,005 commits.

My ownership was concentrated in delivery infrastructure:

- **Per-service CI/CD workflows** for every service, with 10 to 15 commits each from me against
  roughly one each from everyone else.
- **Production Kubernetes manifests** for `explorer-api`, `explorer-ui`,
  `websocket-event-publisher`, `gateways`, `aztec-listener` and `ethereum-listener`.
- **The CI/CD migration** itself: **PR #625**, +4,925 lines across 79 files, plus a 459-line
  `docs/ci-cd-migration.md`.
- **AI-agent tooling**: `.opencode/agents/devops.md`, a 296-line agent skill file I am the sole
  author of, and `claude.yml`, which wires `@claude` into pull-request review.
- **Aztec version bumps**: 10 or more, from `0.81.0` to `4.2.0-aztecnr-rc.2`.

I was a significant secondary on the database schema, not its author: Filip has roughly 99 touches
there against my 41, and mine concentrate in migrations `0032` to `0035`. The README architecture
diagram is his. The `/l2/tips` health canary is his; I built the endpoint it monitors.

## The hard part

The decision that shaped the work was the **unit of migration**. We were moving off a flat Skaffold
setup, where shell scripts rebuilt every service on every push, with no shared base and no layer
cache. The obvious alternative was a single cutover: write all the new workflows and overlays, test
them together, and switch on a quiet weekend. We rejected it because a broken pipeline would have
taken every service down at once, and because there would be no working reference to diff against.

Instead we migrated **one service at a time**, with `explorer-ui-v2` as the live pilot. Each service
got `services/<name>/k8s/{base,overlays/{mainnet,testnet,devnet}}`, a path-filtered workflow, and a
deploy step that was only `kubectl apply -k`. The old pipeline kept deploying the other seven
services the whole time.

The cost was months of carrying two deployment systems and a migration that was slower than a weekend. The benefit showed up exactly once
and paid for itself: a Kustomize transform bug surfaced on one pilot route instead of everywhere.

`nameSuffix` rewrites `metadata.name` on your resources. It does **not** rewrite
`HTTPRoute.spec.rules[].backendRefs[].name`. So a suffixed Service can leave an HTTPRoute pointing
at a name that no longer exists. Traffic does not fail loudly; it routes to nothing. Because the
cutover was per service, the old path was still up while we found it. The invariant went into the
migration doc, which is a little late.

## Outcome

- Nine services, each with its own Dockerfile and its own path-filtered workflow.
- Eleven shared workspace packages and 37 SQL migrations.
- Five environments running the same overlays, with the target network derived from the pushed
  branch: `production` to mainnet, `production-testnet` to testnet, `production-devnet` to devnet.
- Builds separated from deploys, with layer caching and `workflow_dispatch` for manual redeploys.
- Three production networks still tracking independent Aztec versions, which was the constraint
  that made the branch model necessary in the first place.

## What I'd do differently

I would write the overlay invariants down before the first service, not after the first incident. Two
rules were worth a page each and we learned both by breaking something: `nameSuffix` does not reach
every reference, and a `.dockerignore` that defaults to deny silently breaks new service builds until
every needed extension is allowlisted. A short "before you add a service" checklist at the top of
the migration doc would have cost an hour and saved two debugging sessions. Documenting the system
after it works is not the same as giving the next person a map.

## Artefact

A minimal reproduction of the `nameSuffix` problem, built with `kustomize v5.4.3`. The overlay adds
`nameSuffix: -v2`:

```yaml
  # overlay/kustomization.yaml
resources:
  - ../base
nameSuffix: -v2
```

The base contains a Service and an HTTPRoute that both use the name `explorer-api`. The build
rewrites the Service name and leaves the route's backend reference untouched:

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

The route looks valid, applies cleanly, and points at a Service that no longer exists.

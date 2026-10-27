---
title: 'The 10-minute local development environment'
description: 'One command, a full multi-service Kubernetes stack, sanitized production-shaped data, and three attachable frontends.'
pubDate: 2026-10-20
tags: [kubernetes, developer-experience, platform]
project: okutama
---

The test of a local development environment is not whether it exists. It is whether a new engineer
can go from a fresh clone to a running stack, with representative data, without asking anyone a
question.

Most teams fail that test. They have a README with six services and six sets of instructions, a
docker-compose file that covers two of them, seed data that is three rows of `lorem ipsum`, and a
frontend that can only talk to a deployed API. The result is that nobody runs the system locally,
which means nobody finds integration bugs until staging.

On this platform the target was one command, a full multi-service stack on Kubernetes, real but
sanitized data, and any of three frontends attachable to it. Cold start was documented at about ten
minutes. This post is how that was built and what it costs to keep.

## The shape of the thing

The command is:

```console
$ ./scripts/setup.sh k8s --setup --preset full
```

`--setup` provisions the cluster. The preset chooses how much of the platform to run. `full` asks
for a six-CPU, twelve-gigabyte Minikube profile; `minimal` asks for four CPU and eight gigabytes and
skips the heavier pieces. The cluster is Minikube on purpose: it gives you a real Kubernetes API, so
the manifests, the Gateway API resources and the probe behaviour are the same shapes you run in
staging and production.

The script does four things in order:

1. Creates or reuses the Minikube profile, including the CPU and memory request.
2. Builds every service image locally and loads it into the cluster.
3. Applies the local Kubernetes manifests, including the shared infrastructure.
4. Restores a sanitized data snapshot, runs migrations, and wires the port-forwards.

That ordering is the whole design. The cluster exists before the images, the images exist before the
manifests, and the data arrives after the schema is in place.

## Images that never touch a registry

The local build is deliberately different from CI in two settings:

```yaml
  # local build configuration (simplified)
build:
  push: false
  useBuildkit: false
```

`push: false` means the image is built and loaded straight into the cluster. Nothing is tagged for a
remote registry, nothing is authenticated, and nothing is pulled over the network on the next
`kubectl apply`. On a laptop that is the difference between a two-minute feedback loop and a
ten-minute one.

`useBuildkit: false` is the less obvious choice. BuildKit is faster and it is what CI uses, but it
adds a daemon dependency and a layer cache that behaves differently inside a VM. For local work the
priority is that the build works the same way every time, including on a machine that has never run
a container build before.

There is a third detail that looks like a mistake until you see why: the build context sits one
level above the service directory. That is required so a service Dockerfile can `COPY` a sibling
shared package. It also means the `.dockerignore` has to be written for the wider context, which is
its own footgun. I have watched a build fail with `Cannot read file '.../tsconfig.json'` because a
new file extension was not allowlisted. The fix is to treat the ignore file as part of the service,
not as an afterthought.

## Data that behaves like real data

The single biggest reason local environments go unused is that they are empty. An empty database
means you cannot reproduce a slow query, a pagination bug, a weird unicode name, or a null that only
exists because of a historical migration.

This setup restores a snapshot of staging data on a weekly cadence. The snapshot is sanitized before
it is stored: direct identifiers are removed or replaced, and the result is a dataset with the same
shape and roughly the same distribution as the real thing. A developer gets enough rows to see a
query plan and enough edge cases to hit the code paths that only appear in production.

The rule that matters is that production is never the source of a developer snapshot. The source is
staging, the transformation is scripted, and the sanitized artifact is what gets restored. If the
transformation lives in someone's shell history, it is not a sanitization process; it is a hope.

Migrations run as part of the restore, not as a separate step. That keeps the local schema and the
snapshot in sync, and it means the migration runner gets exercised on every cold start. A migration
runner that only runs in production is a migration runner you find out about during a deploy.

## Three frontends, one API

The frontend story is where a lot of local setups stop. The backend runs, but the UI needs a
deployed API because it was never built to point anywhere else.

Here, three frontends can attach to the local stack from their own checkouts. They are separate
applications, and they do not have to be in the same repository or the same cluster. Each one points
at the local API through the port-forward, with its own local environment file. That keeps the
frontend's development loop fast and keeps the platform script from knowing how to build every UI.

The tradeoff is that attaching a frontend is a manual step. The script gets the platform to a
running state; choosing which frontend to attach is a developer decision. I think that is the right
split. A local environment that tries to run every possible client at once is a local environment
that runs out of memory on the laptops of half the team.

## What it cost

Keeping this working is real work. The harness is code, and it drifts:

- A new service needs an image build entry, a manifest, and a port-forward.
- A change to a shared package invalidates every image that copies it.
- A new required environment variable breaks startup until the local values are added.
- The Minikube profile has to fit on an actual laptop, which caps how much of the platform `full`
  can run.

The other cost is parity. Minikube is not the production cluster. It has a single node, no cloud
load balancer, and a different storage class. The Gateway API resources behave the same way, but the
thing underneath them does not. That is acceptable for application development and not acceptable as
a rehearsal for a control-plane upgrade. Knowing which one you are using the environment for is part
of the design.

There is also a data cost. Sanitizing a snapshot every week needs to be automatic, because a manual
step will eventually be skipped, and a skipped sanitization step is a privacy incident with a
developer laptop at the end of it. The transform has to fail closed: if a field is not explicitly
allowed, it does not go into the snapshot.

## What I'd do differently

I would add a smoke test to the setup itself. The script can finish successfully and still leave a
stack that cannot serve a request, because a pod is crash-looping or a port-forward was taken by
another process. A single check at the end, one request through the gateway and one through the
frontend, would turn "the setup command exited 0" into "the environment is actually usable."

I would also version the preset as a contract. When a new service is added, the preset should fail
in CI if the service is not represented, the same way a missing manifest fails a deploy. That turns
a documentation problem into a build error, which is the only kind of documentation that stays
current.

## What to steal

- Make one command the entry point, and make it idempotent.
- Build images locally, load them into the cluster, and skip the registry for local work.
- Restore sanitized, production-shaped data, not seed rows.
- Run migrations as part of the restore so the runner is exercised.
- Keep frontends attachable rather than bundling every client into the platform script.
- Accept that the harness is code and give it an owner.

## Artefact

The interface and the two settings that make the loop fast. This is the part of the environment a
new engineer actually types:

```console
$ ./scripts/setup.sh k8s --setup --preset full
  # preset full   : 6 CPU / 12 GB, full stack, ~10 minutes cold
  # preset minimal: 4 CPU /  8 GB, core services only
```

```yaml
  # local image build — built, not pushed
build:
  push: false
  useBuildkit: false
  context: ..          # one level up, so a service can COPY the shared package
```

Everything else in the environment is downstream of those choices: a real cluster, images that load
in seconds, data with the right shape, and a port-forward that any frontend can point at.

---
title: 'The Grid — API platform'
role: 'Contractor · Platform Engineer'
period: 'Oct 2025 – Aug 2026'
repo: ''
live: ''
stack: [Go, Kubernetes, EKS, Envoy Gateway, ArgoCD, MCP]
status: 'private'
summary: 'Rebuilt a Web3 data platform from Lambda and App Runner onto Kubernetes, then gave AI agents one governed MCP path to its data.'
featured: true
order: 2
tags: [kubernetes, platform, ai-agents]
---

## The problem

The backend was AWS Lambda functions and App Runner services, provisioned by hand-run AWS CLI
scripts. No GitOps, no shared cluster, no environment separation, and no local development story.
Every deploy depended on running the right scripts in the right order against the right account.

That is survivable for one service. It stops being survivable when the product needs a repeatable
path from a laptop to production.

## My role and what I owned

I founded the repository. The first commit, `80a117e`, is mine, and the first production deploy
landed the same day. Across two engagements I wrote **342 of 1,963 commits** and opened **40 pull
requests**, the second-largest contributor overall.

What I owned, with receipts:

- **The bootstrap and first production deploy**, plus the first two services,
  `user-management-api` and `media-management-api`.
- **The Go/Python to Kubernetes integration**: **PR #17**, +37,766/−80 across 196 files. It moved the
  application onto the cluster, introduced ArgoCD, bootstrapped the migration runner, and added the
  first Hasura DDN connector configs.
- **Ingress, from nginx to Envoy Gateway**, in all three environments: PRs #13, #37 and #38.
- **Per-service CI workflows and ArgoCD application manifests** for staging and production.
- **The Grid MCP Server, Phase A**, end to end: PRs #495 to #502.
- **The EKS upgrade decision record**, ADR-0008, and its adversarial self-review in PR #498.

Some of this platform is not mine. The Unified Permissions System is a teammate's build; my commits
consume it from the MCP side. The Aurora MySQL schema series is another teammate's work. The final
removal of the dead nginx definitions was someone else's commit, ten weeks after my cutover.

## The hard part

The ingress migration is the decision I would defend. We were replacing
nginx-ingress with Envoy Gateway and the Gateway API, and the tempting move is one pull request for
all three environments, because on paper it is the same change.

We rejected that. A mistake in an ingress controller is not a degraded feature; it is every request
failing at once. We also rejected staying on nginx indefinitely, because the Gateway API was where
the ecosystem was going and we wanted the migration done while the platform was still small.

Instead we moved **one environment at a time**. Local and staging went first in PR #13. Production
followed ten days later in PR #38. The old nginx path stayed
installed for roughly **ten more weeks** after the production cutover before the dead definitions
were removed.

The cost was two ingress stacks to understand, two sets of TLS and routing configuration to keep
consistent, and a period where debugging started with "which controller is answering this request?"
It bought a rollback that required no rebuild.

One limitation was structural. Staging runs a single-node K3s cluster, so it cannot rehearse an EKS
control-plane upgrade. The ingress change could be rehearsed there; the later cluster upgrade could
not. That tradeoff belongs in writing.

## Outcome

The repo ended with **12 services**, **8 decision records** and **35 dated design documents**. Deploys ran through ArgoCD with Kustomize: staging auto-synced, production kept a manual
gate. Deploy frequency, counted from the GitOps bot commits, went from **6 in January 2026 to a peak
of 70 in July 2026**. The local stack came up from one command in about **ten minutes**. The MCP
server shipped as the single governed path for agent access to company data.

I am not publishing cost figures or the client's name. The platform work is what transfers.

## What I'd do differently

I would re-verify the platform against the live account before writing any decision that costs
money. My own docs said production ran `t3.medium` nodes and staging was on Hetzner. Reality was
`t3.large` on AWS EC2, with a different instance size again. The same audit found an ADR claiming a
migration tool that is not imported anywhere in the repo. None of those errors was individually
dangerous, but together they meant the document I reached for before sizing a cluster described a
system that had stopped existing. Re-reading docs is not verification. Querying the account is.

## Artefact

Sanitised: no account identifiers, hostnames or registry paths.

| | Before (Oct 2025) | After (Aug 2026) |
|---|---|---|
| Compute | Lambda + App Runner | EKS in production, K3s in staging, Minikube locally |
| Provisioning | Hand-run AWS CLI scripts | Same scripts, labelled legacy; still no IaC |
| Ingress | nginx-ingress | Envoy Gateway on the Gateway API |
| Deploys | Per-service, manual | ArgoCD + Kustomize, auto-sync staging, manual gate production |
| Local dev | None | One command, full stack, ~10 minutes cold |
| Observability | Unclear | Prometheus, Loki, Alloy, Grafana |

The ArgoCD application list is ordered on purpose, so nothing starts before the platform it needs:

```yaml
  # argocd/kustomization.yaml (sanitised)
resources:
  - projects.yaml
  - cert-manager.yaml
  - image-updater.yaml
  - admission.yaml
  - envoy-gateway.yaml
  - external-secrets.yaml
  - kube-prometheus-stack.yaml
  - loki.yaml
  - alloy.yaml
  - cloudwatch-exporter.yaml
  - grafana-dashboards.yaml
  - gateway.yaml
  - apps/
```

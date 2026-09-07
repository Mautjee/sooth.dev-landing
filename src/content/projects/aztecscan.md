---
title: 'Aztecscan'
role: 'Infrastructure & Full-stack Engineer'
period: 'Sep 2024 – Jun 2026'
repo: 'https://github.com/aztec-scan/chicmoz'
live: ''
stack: [TypeScript, Go, Kafka, Postgres, Kubernetes, Envoy Gateway, GitHub Actions]
status: 'completed'
summary: 'Block explorer for the Aztec privacy L2. 678 commits over 21 months: indexing infrastructure, full-stack features, and migrating the whole CI/CD pipeline to Kubernetes-native tooling service-by-service without a freeze.'
featured: true
order: 1
tags: [blockchain, kubernetes, infrastructure]
---

# Aztecscan

Aztecscan is a block explorer for the Aztec privacy-focused L2 chain. Over 21 months I
contributed **678 commits** to it across infrastructure and full stack — from the indexer
pipelines that keep block data flowing, to front-end fixes, to the migration of the entire
CI/CD pipeline off a hand-rolled Skaffold setup onto GitHub Actions + Kustomize.

## What I worked on

- **Indexing infrastructure** running on Kubernetes, with Kafka at the centre of the data
  path and Postgres as the store.
- **Progressive CI/CD migration** — moved services one at a time onto the new pipeline, with
  `explorer-ui-v2` as a live pilot while the old pipeline kept deploying the other seven.
- **Migrating ingress from nginx to Envoy Gateway**, one network at a time across the
  devnet / testnet / mainnet branches.
- **Dropped-transaction false positives** — a mempool-sync fix that added a `suspected_dropped`
  intermediate state with a 30s grace period instead of a crude timeout.

## Agents, made safe for production

A thread running through the work: giving AI agents the context and guardrails to operate
near production. That included a ~296-line `devops.md` agent persona encoding the repo's
Kafka conventions and release process, wiring `@claude` into GitHub code review, and
delegating review fixes to a coding agent with self-verification.

## Was it honest?

Two of the most attention-grabbing things an explorer could brag about aren't mine to claim
(protocol internals, etc.) — so this page sticks to the infrastructure, the migration, and
the agent tooling, where the work is verifiable in the repository.

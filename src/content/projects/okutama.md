---
title: 'The Grid — API platform'
role: 'Contractor · Platform Engineer'
period: 'Oct 2025 – Aug 2026'
repo: ''
live: 'https://api.thegrid.id'
stack: [Go, Kubernetes, EKS, Envoy Gateway, ArgoCD, MCP]
status: 'private'
summary: 'Rebuilt a gamedata API platform from serverless sprawl to a governed Kubernetes platform, including a UPS-authenticated MCP server that gives AI agents one enforced path to company data.'
featured: true
order: 2
tags: [kubernetes, platform, ai-agents]
---

# The Grid — API platform

A year-long platform rebuild for a client, migrating their gamedata API off a serverless
sprawl and onto a governed Kubernetes platform. This page is deliberately light on detail
because the client and specific figures are under NDA.

## What I worked on

- Took the service stack from **AWS Lambda / App Runner onto Kubernetes (EKS)**, one
  environment at a time — local + staging first, then production ten days later, and kept
  the old deployment topologies around as `-deprecated` manifest sets until the cutover was
  proven.
- **Ingress migration to the Gateway API / Envoy Gateway**, again incrementally.
- A properly-gated testing story: per-service unit-test CI gates and migration-level tests
  that run against the schema.

## Governed AI-agent data access

The flagship piece: a **Grid MCP Server** — a stateless, UPS-authenticated MCP server giving
every AI agent a single enforced path to company data, instead of ad-hoc reads and bespoke
write routes. It's one of the clearest examples I have of what it takes to let agents work
near production safely: an enforced data path, fail-closed auth, and a human-confirmation
interlock in front of the irreversible operations.

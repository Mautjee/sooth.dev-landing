---
title: 'Olla Finance — Liquid Staking'
role: 'Frontend & Backend Engineer'
period: '2025 – 2026'
repo: 'https://github.com/ollafinance/olla-ui'
live: ''
stack: [TypeScript, Go, Kubernetes, Data Pipelines, React]
status: 'completed'
summary: 'Liquid staking protocol for the Aztec privacy L2, built with a 3-developer team. Owned the frontend and Go backend services — including the data pipelines that keep staking data accurate — on the same Kubernetes platform as the block explorer.'
featured: false
order: 3
tags: [blockchain, liquid-staking, kubernetes, frontend]
---

# Olla Finance — Liquid Staking

Olla Finance is a liquid staking protocol for the Aztec Network, built with a
3-developer team. I owned the **frontend** and the **Go backend services** behind it,
including the data pipelines that present users with accurate, up-to-date staking data.

## What I worked on

- **Frontend** — the public `olla-ui` interface (TypeScript/React), the main product surface
  for users.
- **Go backend services** — the services supporting the interface, from staking data
  retrieval to pipeline work.
- **Data pipelines** — keeping the staking data users see accurate and current on-chain.

## One platform, two products

For the infrastructure, I designed the block explorer's Kubernetes platform to run
multiple applications on the same hardware. Rather than standing up a whole new stack for
Olla, it became another workload on that platform — reusing its CI/CD, monitoring and
deployment setup, saving infrastructure cost and setup time.
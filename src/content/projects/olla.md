---
title: 'Olla Finance — Liquid Staking'
role: 'Frontend & Backend Engineer'
period: '2025 – 2026'
repo: 'https://github.com/ollafinance/olla-ui'
live: ''
stack: [TypeScript, Go, Kubernetes, Data Pipelines, React]
status: 'completed'
summary: 'Liquid staking for the Aztec L2. Frontend, Go backend services and data pipelines in a three-developer team, on the same platform as the explorer.'
featured: false
order: 4
tags: [blockchain, liquid-staking, kubernetes, frontend]
---

## The problem

Olla Finance is a liquid staking protocol for the Aztec Network. A user needs to see what they have
staked, what it is earning, and what the protocol is doing with it, without reading chain state
themselves.

That requires three things to agree: a frontend that presents staking data, backend services that
answer for it, and pipelines that keep the numbers current. A staking UI that shows yesterday's
balance is worse than no UI.

## My role and what I owned

I worked on Olla in a three-developer team. My part was the product surface and the services behind
it:

- **Frontend**, in `ollafinance/olla-ui` (TypeScript and React). This was the main user-facing
  product, and it is the part of the work with the clearest public trace: the repository has **70
  commits** under my GitHub handle.
- **Go backend services** supporting that interface, from staking data retrieval to the handlers the
  UI calls.
- **Data pipelines** that keep the staking data accurate and current against chain state.

Some of this is owner-asserted rather than audited. There is no deep-dive document for this project
in the same way the other four have, so the team size, the Go services and the pipeline scope come
from my own record of the work. The commit count in `olla-ui` is checkable; the shape of the backend
is described more carefully than it is proven. I would rather say that than dress it up.

## The hard part

The interesting decision was not in the staking logic. It was where the product ran.

The block explorer already had a Kubernetes platform: CI/CD, monitoring, secrets, ingress, and a
deployment path that had been exercised for months. Olla needed the same things. Standing up a
second platform would have duplicated all of it, and a second platform is a second thing to patch,
monitor and learn during an incident.

We ran Olla as another workload on the existing platform, with its own services and its own
isolation, rather than as a new stack. The alternative was a clean, product-specific environment
that could change without coordinating with the explorer. We rejected it because the cost was not
the first deploy; it was every deploy after it, and every security patch applied twice.

The tradeoff is coupling. A platform upgrade now has two consumers, and a change that suits the
explorer has to be checked against a staking product with different traffic and different failure
modes. That is manageable with two products and a small team. It would not stay manageable with ten.

## Outcome

The liquid-staking product shipped on the shared platform. It reused the explorer's CI/CD,
monitoring and deployment setup instead of introducing a second one, which was the point of the
decision: a second product could exist without a second full-time platform.

I am not claiming user numbers, total value locked, uptime or audit outcomes for this project. None
of those are in the public record I can point at, and this page is more useful with a smaller true
claim than a larger unverifiable one.

I also have no artefact for this page. The other four projects each carry a manifest, a transcript
or a contract that can be checked; Olla does not have one that I can publish without exposing
client material, and an illustrative diagram would not add anything a reader could verify. The gap
is noted here rather than filled with something decorative.

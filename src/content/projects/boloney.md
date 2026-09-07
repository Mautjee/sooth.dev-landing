---
title: 'Boloney!'
role: 'Full-stack Engineer'
period: 'Aug 2022 – Jun 2023'
repo: 'https://github.com/Kryha/boloney'
live: ''
stack: [TypeScript, Nakama, React, three.js, cannon.js, Aleo, K8s]
status: 'completed'
summary: "Liar's Dice rebuilt as a realtime multiplayer game with (real, but not my) zero-knowledge dice. I built the game a ZK system plugged into: the match state machine, the timer/AFK-recovery service, six power-ups end to end, the Aleo-wallet auth flow, and the physically-simulated 3D dice UI."
featured: false
order: 4
tags: [gaming, realtime, webgl, fullstack]
---

# Boloney!

Boloney! is Liar's Dice as a real-time multiplayer game on a Nakama game server, built at Kryha
as a public showcase for Aleo's zero-knowledge blockchain. I was one of six regular contributors
across ~10 months, working full-stack (Nakama backend + React frontend).

## The framing that matters most

Boloney's headline is **"Liar's Dice with real zero-knowledge proofs,"** and it genuinely is.
But the ZK work itself lives in a separate repo, `zk-gaming-toolkit`, where I have **one commit
of 107**. The proofs and circuits, the commit-reveal hash-chain RNG, and the ZK enable/disable
plumbing were all teammates' work.

So my honest claim is specific and true: **I built the game a ZK system had to plug into.** The
one thing I can point at directly in the ZK direction is that I deleted the placeholder dice
roller that called a public random-number API — twice, nine months apart — as the real
Aleo-backed integration came online. I retired the "fake" RNG so the real one could take its place.

## What I owned

- **The match state machine, generations 1 & 2** — from a bare `switch` with empty stages to the
  stage-flow with readiness tracking that the team later refactored into a third generation.
- **The backend timer service** — stage timeouts tied to Nakama's tick rate, with
  `handleOutOfTime` auto-rolling dice, force-advancing stuck stages, or forfeiting an AFK
  player's turn so a real-time match never stalls on a disconnected player.
- **Six power-ups end to end** — backend logic, types, and frontend UI (Heal Dice, Hypnosis,
  Smoke and Mirrors, Menage à Trois, Vendetta, Second Chance).
- **Aleo-wallet auth, built twice** — an early Aleo-account hook, then the full Leo-wallet
  signature flow.
- **Physically simulated 3D dice** — `three.js` + `cannon.js` rigid-body physics for how dice
  tumble and settle, reconciled against a server-authoritative roll value the physics didn't
  control. Not a CSS keyframe of a die face: the dice had to look physical *and* land on a value
  the simulation had no say in.

## What I did *not* build — said plainly

The ZK circuits and proof generation (`zk-gaming-toolkit`), the hash-chain RNG, and the game's
third-generation state machine are not mine. Some of the more exciting-looking output of this
project belongs to teammates, and I won't fold it into "things I built."

## A real tradeoff

Frontend was ~33k lines of TypeScript but just **one test file** despite a fully configured Jest
setup, and the project shipped **zero versioned releases** — deploys were continuous off
long-lived branches. Fine for a showcase game; worth naming plainly.
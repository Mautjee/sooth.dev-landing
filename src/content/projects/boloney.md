---
title: 'Boloney!'
role: 'Full-stack Engineer'
period: 'Aug 2022 – Jun 2023'
repo: 'https://github.com/Kryha/boloney'
live: ''
stack: [TypeScript, Nakama, React, three.js, cannon.js, Aleo, K8s]
status: 'completed'
summary: "Liar's Dice as a realtime multiplayer game behind a zero-knowledge showcase. Built the match state machine, timers, six power-ups and the wallet auth."
featured: false
order: 5
tags: [gaming, realtime, webgl, fullstack]
---

## The problem

Boloney! is Liar's Dice as a real-time multiplayer game, built at Kryha as a public showcase for
Aleo's zero-knowledge platform. The headline is that dice rolls can be proven fair.

A proof layer is not a game. Before that matters, the game needs players in a room, a match loop with
turns and stages, a timer that resolves an absent player's turn, wallet identity, and a UI where a
bid can be placed without ambiguity.

## My role and what I owned

I was one of six regular contributors across roughly ten months, writing **87 of 1,228 commits**
(about 7%). I was mid-pack by volume, full-stack across the Nakama backend and the React frontend.

What I owned:

- **The match state machine, generations one and two.** `44a6389a` started as a game loop with
  placeholder stages. `91372108` gave the stages their real names and added readiness helpers that
  made transitions track per-player state. `f8d932e7` reworked the lobby and join flow.
- **The backend timer service** (`2f42a6cd`, a 96-line `services/timer.ts`) that resolves stage and
  turn timeouts, plus the notification system shipped end to end (`bfedc840`).
- **Six power-ups**, full-stack: Heal Dice, Hypnosis, Smoke and Mirrors, Menage à Trois, Vendetta and
  Second Chance, each with server logic, shared types and frontend UI.
- **Aleo wallet auth, built twice**: an early account hook in `a34fe1d8`, then the full Leo Wallet
  signature flow in `4f922908`.
- **The 3D dice UI and audio**, the Die and PowerUp components, and the original Rollup build
  configuration (`33cccd82`).

The zero-knowledge work is not mine. The proofs and circuits live in a sibling repository where I
have **one commit out of 107**. The commit-reveal hash-chain RNG and the ZK toggle plumbing here are
teammates' work, as is the later `stage-handlers.ts` refactor. The one ZK-adjacent thing I can point
at is smaller than it sounds: I removed the placeholder dice roller that called a public
random-number API, twice, nine months apart.

## The hard part

A real-time match breaks the moment one player stops responding. The easy design gives the client the turn
timer and trusts it to move on. That fails in exactly the situation the timer exists for.

We made the server authoritative over time. `services/timer.ts` ties stage duration to Nakama's tick
rate and defines per-stage timeouts: 30 seconds for power-up, dice-roll and round-summary, 60
seconds for a player's turn. When one expires, `handleOutOfTime` does one of three things depending
on the stage: auto-roll the dice for anyone who has not rolled, force-advance a stage that is stuck,
or auto-forfeit the active player's turn and hand play to the next player.

The tradeoff is a timer per stage and a deterministic recovery path that must be correct for every
stage, including later ones. That is more state to get right than a client-side countdown, and it is
the only version where a disconnected player cannot stall the match for everyone else.

## Outcome

Two generations of the match loop shipped, along with six power-ups. The backend ran as Rollup-bundled
TypeScript modules inside stock `heroiclabs/nakama:3.13.1`, with seven backend test files. Deploys
were continuous off long-lived branches.

There are no GitHub pull requests to cite for any author: GitHub is a mirror of an Azure DevOps
repository, where the review history stayed. The evidence here is commit SHAs. I have no player or
match numbers and am not going to invent them.

## What I'd do differently

The placeholder RNG is the thing I would change. A dice roller that called a public random-number
API lived in the codebase twice, deleted once in September 2022 and again in June 2023. Deleting it
twice means the second caller was added after the first deletion, which means the dependency was not
behind a single seam. I would have put every roll behind one interface on day one, made the fake
implementation obviously temporary, and put an owner and a date on it. The ZK integration was always
going to replace that implementation; making the seam explicit would have made the replacement a
one-file change instead of a hunt.

## Artefact

The timing rules are the contract that keeps a match moving. These are the values in
`services/timer.ts` and the stage names from the generation-two state machine:

| Stage | Timeout | What happens on expiry |
|---|---|---|
| Power-up selection | 30 s | Skip the pick, advance |
| Dice roll | 30 s | Auto-roll for the player |
| Player turn (bidding) | 60 s | Forfeit the turn, pass play on |
| Round summary | 30 s | Advance to the next round or end |
| Lobby | none | Wait for ready players |

```text
lobbyStage
  -> getPowerUpStage      (30s, auto-skip)
  -> rollDiceStage        (30s, auto-roll)
  -> playerTurnLoopStage  (60s per turn, auto-forfeit)
  -> roundSummaryStage    (30s, auto-advance)
  -> endOfMatchStage
```

`handleOutOfTime` is the only place that decides what an expired stage means, which is what makes the
recovery path reviewable in one read instead of scattered across six handlers.

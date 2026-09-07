---
title: 'Bot Busters'
role: 'Backend Engineer'
period: 'Oct 2023 – Feb 2024'
repo: 'https://github.com/Kryha/bot-busters'
live: ''
stack: [TypeScript, Next.js, tRPC, Drizzle ORM, Postgres, AWS Bedrock, GKE]
status: 'completed'
summary: 'A multiplayer social-deduction game where LLM bots try to pass as human in a group chat. I built the match/scoring state machine the bots had to survive, an eight-rule achievements engine, and the wallet-plus-anonymous auth flow — not the bot-AI itself.'
featured: false
order: 3
tags: [gaming, realtime, auth, typescript]
---

# Bot Busters

Bot Busters drops you into a group chat with other players, one to three of whom are LLM-driven
bots trying to pass as human. After a timed chat round, everyone votes on who they think the bot
was. I joined a month into the project and spent ~4.5 months as the backend engineer building the
parts that make the game *fair and worth playing again*.

## What I owned

- **The match / game-state machine** (`match.ts`): an in-memory class, one instance per active
  room, driving stage transitions (chat → voting → results) off wall-clock elapsed time. It
  includes the server-authoritative anti-cheat decision I'm proudest of: the `isBot` flag is
  stripped from every outbound payload until the reveal, so no client can peek at a secret it can
  inspect over the wire.
- **`calculatePoints()`** — the whole reveal scored in one pass: bots busted, humans wrongly
  busted, humans fooled.
- **An achievements system as a small rules engine** — eight self-contained achievement records
  (`{name, description, calculate}`) evaluated against one shared context object. Legible enough
  to walk through end to end, shipped across six PRs.
- **Wallet + anonymous auth** — anonymous play as a first-class mode, not a fallback, sitting
  next to wallet-verified identity that gates which achievements count.
- **DB access-layer extraction** and a **match-history join table** (`user_match`) that replaced
  deserialising every match's JSON blob just to answer "how many matches has this user played?"

## What I did *not* build — said plainly

The thing most people find interesting about this project is **the bot-AI itself**, and that's
not my code. The personality-driven prompting, the randomized read-delay and typing-time pacing,
and the seven-model / four-provider Bedrock roster were written by a teammate (Ramiro), in files
I have zero commits on. My contribution was the system those bots plug into — the match,
scoring, and achievements that decide whether a bot actually fooled anyone. "I built the game
the bots had to survive" is the honest way to put it.

## A real tradeoff, not a highlight reel

The repo had exactly **one test file** and one CI workflow that auto-deployed every push to GKE
staging with no test or lint gate. That's a move-fast, small-team setup — and it's worth saying
out loud rather than implying a rigorous test culture existed.
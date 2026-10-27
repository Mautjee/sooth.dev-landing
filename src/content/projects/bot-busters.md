---
title: 'Bot Busters'
role: 'Backend Engineer'
period: 'Oct 2023 – Feb 2024'
repo: 'https://github.com/Kryha/bot-busters'
live: ''
stack: [TypeScript, Next.js, tRPC, Drizzle ORM, Postgres, AWS Bedrock, GKE]
status: 'completed'
summary: 'A social-deduction game where LLM bots pass as human. Built the match and scoring state machine, the achievements engine, and the auth flow — not the bot AI.'
featured: true
order: 3
tags: [gaming, realtime, auth, typescript]
---

## The problem

Bot Busters puts a handful of players and one to three LLM-driven bots into a group chat. The bots
try to pass as human. After a timed chat round, everyone votes on who they think was a bot.

For that to be a game rather than a demo, the server has to own the match: stage transitions, vote
validity, who fooled whom, and what happens when a player closes the tab.

## My role and what I owned

I joined a month in and spent about four and a half months as backend engineer, from October 2023 to
February 2024. I wrote **44 commits and 43 of the repo's 254 pull requests**, the third-largest
contributor behind Privilege Mendes and Marius Sili.

What I owned:

- **The match state machine**, `src/server/service/match.ts`, my most-touched file at 13 commits.
  One in-memory instance per active room, driving chat to voting to results on wall-clock time.
- **Vote resolution and scoring**: `vote()` enforces the integrity rules, and `calculatePoints()`
  scores the reveal in one pass, including bots busted, humans wrongly busted, and humans fooled.
- **The achievements engine**, `src/server/service/achievements.ts`: eight of its nine commits are
  mine, shipped across PRs #143 through #307.
- **The DB access layer extraction** (PR #64) and the `user_match` join table (PR #171), which
  replaced deserialising every match's JSON blob to answer "how many matches has this user played?"
- **Wallet and anonymous auth**, anonymous play as a first-class mode, plus the profanity filter and
  a 150-character message cap (PR #291).

What I did not build matters here. The bot AI is a teammate's file: `agent.ts` has 14 commits from
Ramiro and zero from me, as do the personality matrix, model roster and pacing logic. The schema is
a co-authorship with Marius. The later on-chain leaderboard and payout work landed after my window.
My contribution is the system the bots plug into.

## The hard part

The design problem is secrecy. If the client receives an `isBot` field and merely hides it, anyone
with a network tab has the answer. If bots get a visibly different identity pool, players learn to
read identity instead of behaviour. Both shortcuts make the game trivially solvable.

We chose to keep the answer on the server until the reveal. Every outbound payload passes through a
single serialiser, `toSerializable()`, which strips the `isBot` flag. Human and bot characters draw
their identities from the same shuffled pool, so a character name never correlates with a bot.
Only at the results stage does the server include the flag.

That costs a serialisation pass on every message and a match state that persists the hidden truth
for the whole round. It also means every new payload type is a place where the flag can leak, a
review burden you do not have if you never store the secret. The cheaper alternative would not have
been a game.

## Outcome

The build-phase game shipped. The eight achievements landed across PRs #143 to #307 between
December 2023 and February 2024. One `match.ts` state machine drove the whole match: three minutes
of chat, thirty seconds of voting, a results stage, and a hard ten-minute TTL on the room. The timings
and the bot cap of `min(3, PLAYERS_PER_MATCH)` are constants in that file.

I do not have player counts, matches per day or uptime for this project, so I am not going to cite
them.

## What I'd do differently

The repo had one test file and a CI workflow that deployed every push to staging with no test or
lint gate. I called that a fast-ship tradeoff. The state machine was the one thing that deserved
tests: it held the game's rules, it was pure enough to test without a browser, and its bugs would
surface as unfairness rather than as errors. A handful of tests around stage transitions and
`calculatePoints()` would have cost an afternoon.

## Artefact

The match is a small fixed set of timings, and the secrecy contract is one method. Both are real
contracts from `match.ts`:

| Stage | Duration | On expiry |
|---|---|---|
| Chat | 3 minutes | Advance to voting |
| Voting | 30 seconds | Tally and reveal |
| Splash / results | 6.5 seconds | Advance to the next round or end |
| Whole match | 10 minutes hard TTL | Force end |
| Bots per match | 1 to 3, `min(3, PLAYERS_PER_MATCH)` | Selected at match creation |

```text
toSerializable(stage):
  for each player:
    emit id, name, characterId
    emit isBot ONLY when stage == "results"
```

The important word is ONLY. The field is absent from the payload before the reveal, not present and
false, and there is no client-side filter to remember.

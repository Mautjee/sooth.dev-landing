---
title: "What an AI agent needs before you let it near production"
description: 'Across two projects I gave AI agents what they needed to be trusted near production: the codebase''s conventions in writing, a governed data path instead of ad hoc access, and a human interlock in front of the irreversible operations.'
pubDate: 2026-09-05
tags: [ai-agents, platform, mcp, guardrails]
project: okutama
---

In 2026 the interesting problem isn't "can an agent write code." It's *what does an agent need so
it can be trusted near production, and what guardrails stop it destroying something?*

I've answered that question twice, in two projects, in two different forms — with commits behind
both.

## 1. Give it the codebase's conventions in writing

Before an agent can be useful on a codebase it has to know the conventions, and you can't expect
it to re-derive a year of unwritten tribal knowledge. At **Aztecscan** I wrote those down.

- `.opencode/agents/devops.md` — a 296-line agent skill library, two commits, both mine, listing
  this repo's Kafka conventions, React patterns, and release process.
- Five more agent personas and six skill guides (~2,055 lines total) teaching an agent the same.
- `.github/workflows/claude.yml` (four commits, all mine) wiring `@claude` into GitHub code
  review — and I actually used it on my own PRs.

The point isn't the tooling. It's that a thing with no context and no memory was given the
context in writing, and then used. I also delegated my own review feedback to an autonomous
coding agent twice, and asked it to self-verify before I accepted it. Once the agent has the
rules, you can hand it real work.

## 2. Give it a governed data path instead of ad hoc access

The second answer is the one I'm told is rare, and it's the newer of the two: **give the agent
one enforced path to the data, rather than scattered read access and bespoke write routes.**

At The Grid, agents (and unpaid/unauthenticated reads) had no safe path to company data.
Reads were anonymous, writes went through bespoke code, and external clients couldn't connect at
all. The fix (PRs #495–#502) was a **Grid MCP Server** — stateless HTTP, UPS-authenticated,
fail-closed credential exchange, JWKS caching, delegating every read and write to the backend.

My own PRD line is the cleanest statement of it:

> "agents and tools have no standard, safe path to Grid data. Reads are anonymous, writes route
> through bespoke code, and external clients can't connect at all. One governed MCP server —
> UPS-authenticated, delegating every read and write to go-backend, internal-first then external —
> gives every agent the same enforced path."

Instead of an agent knowing how to reach a dozen endpoints, it knows how to reach one, and that
one enforces who can read what and who can change what.

## 3. Put a human interlock in front of the irreversible

Neither of the above helps if the agent can quietly delete something it can't restore. The
guardrail that binds it all together is making the destructive operations require a human to
confirm — a fail-closed interlock in front of anything irreversible.

## The through-line

Two years, two ecosystems, three projects, one conviction: an agent near production needs (a)
the codebase's rules in writing, (b) a governed data path instead of ad hoc access, and (c) a
human confirmation before the operations that can't be undone.

The skill library gives it context. The governed path gives it authority with bounds. The
interlock gives it a floor. Steal all three.
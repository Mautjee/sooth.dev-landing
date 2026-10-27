---
issue: SOOT-26
parent: SOOT-25
title: sooth.dev v2 — executable spec
date: 2026-10-27
base: main @ 1e24b34
status: ready for build; every open decision carries a default (see §8)
---

# sooth.dev v2 — executable spec

This is the build contract for SOOT-25. It turns the work order into decisions: what changes,
in which file, proven by which command. Where the work order and the current tree disagree, this
document records the drift and states the rule the implementers follow.

Read with: SOOT-25 (authoritative work order), `docs/design-portfolio-v2.md` (stage 2, visual
detail), `docs/content-audit.md` (stage 4, claim-by-claim evidence).

---

## 0. Success in one paragraph

A stranger lands on `/` on a 360 px phone and inside ten seconds knows: who Mauro is, that he
builds platforms, one verifiable thing he shipped, and how to contact him. Three project pages
and two posts are worth reading on their own because each carries a real artefact — a manifest,
a command transcript, a PR number, a tradeoff — not adjectives. A shared link renders a card.
A crawler gets a sitemap, an RSS feed and a 404. Nothing on the site moves unless the visitor
asked it to.

---

## 1. Scope

### In scope

1. Redesign of six existing page types (`/`, `/blog`, `/blog/[slug]`, `/projects`,
   `/projects/[slug]`, plus the layout shell) and two new routes (`/about`, `/404`).
2. A code-level design system: tokens for colour, type, space, radius and motion in
   `src/styles/global.css`, plus four new components (§3.2). No component library.
3. Metadata and machine surface on every route: title, description, canonical, Open Graph,
   Twitter card, per-page-type OG image, `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/404`.
4. Accessibility and motion: `prefers-reduced-motion`, contrast fixes, `:focus-visible`, skip
   link, keyboard-tested nav, zero-JS mobile menu, one `h1` per page, no horizontal scroll at
   360 px.
5. Content rewrite: five project pages to the fixed six-section structure at 600–900 words;
   four existing posts expanded to 1,000–1,500 words with at least one artefact each; three new
   posts (backlog #4, #11, #13) at 1,200–1,800 words; one new `/about` page at 400–600 words.
6. Housekeeping that the redesign depends on: `site` in `astro.config.mjs`, stale README,
   unused `formatPeriod`, duplicated HTML shell.

### Out of scope — do not build

- No CMS, comments, newsletter, analytics/tracking, cookie banner, search, dark/light toggle.
- No i18n or Dutch version. English only.
- No DNS, domain, hosting or Dokploy project change beyond redeploying the sooth.dev app.
- No rewrite of `public/cv.md` / `public/cv.pdf` content. Keep both URLs working, link only.
- No new writing on gated backlog items (#2, #3, #5, #6, #7, #12, #14, #15). See §5.6.
- No new client-side framework, router, animation library, CSS-in-JS, UI kit, icon pack, or web
  font. No new runtime dependency for OG images, sitemap or RSS (see §3.6).
- No change to existing slugs. If a slug must change, it ships with a redirect in the same PR.
- No invention: no number, logo, testimonial, user count, uptime figure or cost figure that is
  not evidenced in `/home/mauro/portfolio-research/` or in a commit (SOOT-25 §5.1).

### Definition of success for this stage

`docs/spec-portfolio-v2.md` is committed and pushed on a branch. Every AC in §6 names a command
or observation that settles it. Every open decision has a default. Builders can start without
asking a question — except where §8 says a gap blocks a specific claim.

---

## 2. Re-verified diagnosis

Method: every claim in SOOT-25 §1 was re-run against `main` @ `1e24b34` in a fresh clone on
2026-10-27. Commands are in §11. "Confirmed" means the claim still holds; "drifted" means the
fact holds but a cited line moved; "not verifiable" means the evidence named in SOOT-25 is not in
the repo.

| # | Claim from SOOT-25 §1 | Evidence in this tree | Status |
|---|---|---|---|
| D1 | Home page is a link hub: title says "Links", pitch is "Developer & Tech Enthusiast", only social links | `src/pages/index.astro:16` `<title>Mauro Eijsenring - Links</title>`; `:53-55` pitch; `:67-108` four link cards; no link to blog/projects/CV in the body | confirmed |
| D2 | Motion carnival: five floats, per-letter stagger, glow, bouncing divider, hover-scale | `index.astro:25-29` floats; `:35,42` `animate-pulse-glow`; `:43-49` staggered letters; `:58-60` divider + `animate-bounce`; `:67,78,89,100` `hover:scale-105`; animate vars at `global.css:52-55`, keyframes at `:57-79` | confirmed |
| D3 | One narrow column everywhere | `BaseLayout.astro:27` `max-w-3xl`; `Nav.astro:12` `max-w-3xl` (SOOT-25 said `Nav.astro:9` — moved) | drifted (line only) |
| D4 | One heading style repeated | `blog/index.astro:12`, `projects/index.astro:21`, `projects/[slug].astro:25`, `BlogPost.astro:20` all `text-3xl md:text-4xl font-bold text-gruvbox-yellow` | confirmed |
| D5 | Two HTML shells | `index.astro:9-115` re-implements doctype/head/body/nav/footer; `BaseLayout.astro:15-31` does the same | confirmed |
| D6 | Failing contrast on metadata grey | `#928374` on `#282828` = **4.02:1**, on `#3c3836` = **3.16:1** (recomputed, §11.3). Used at `blog/index.astro:13,27,29,34`, `projects/index.astro:22,45,51,54`, `BlogPost.astro:19,21,22,29`, `prose.css:28` | confirmed |
| D7 | Inline code contrast fails | `#d3869b` on `#3c3836` = **4.23:1** (`prose.css:34`); proposed `#e0a3b8` = **5.58:1** | confirmed |
| D8 | Light palette defined but unused | `global.css:21-32` defines `--color-gruvbox-light-*`; `grep -r "gruvbox-light" src/` = 0 uses outside the definition | confirmed |
| D9 | `prose.css` hardcodes hex instead of tokens | `prose.css:3,11,18,21,22,23,25,28,33,34,38,41,42,48,53,54,56,57` — 18 hex literals, zero `var(--color-gruvbox-*)` | confirmed |
| D10 | Raw hex outside `@theme` in `global.css` | `global.css:86-87` `background-color: #282828; color: #ebdbb2;` | confirmed |
| D11 | No reduced-motion handling | `grep -rn "prefers-reduced-motion" src/` = 0 matches | confirmed |
| D12 | No metadata / sitemap / robots / RSS | `grep -rnE "og:|twitter:|canonical|sitemap|robots" src/ astro.config.mjs` = 0 matches; no `src/pages/404.astro`, no `rss.xml`, no `sitemap.xml`; `astro.config.mjs` has no `site` | confirmed |
| D13 | "Confirmed against `dist/`: no 404, no sitemap" | `dist/` is gitignored (`.gitignore:7`) and absent from a fresh clone, so this cannot be re-checked without a build. What is verifiable: no source file produces those routes (§11.2) | not verifiable as stated; conclusion holds from source |
| D14 | Word counts | Blog **589 / 443 / 344 / 360 = 1,736**; projects **325 / 509 / 466 / 264 / 229 = 1,793** (`wc -w`). Identical to SOOT-25 | confirmed |
| D15 | Every project body duplicates the title as `# H1` | `src/content/projects/{aztecscan,olla,boloney,bot-busters,okutama}.md:15` each open with `# …`; layout also renders an `h1` (`projects/[slug].astro:25`) → two `<h1>` in built HTML | confirmed |
| D16 | Project pages have no fixed structure | Headings differ per file: aztecscan `## What I worked on` (:22) / `## Agents, made safe for production` (:33) / `## Was it honest?` (:40); olla `## What I worked on` (:21) / `## One platform, two products` (:29); okutama `## What I worked on` (:21) / `## Governed AI-agent data access` (:31); boloney `## The framing that matters most` (:21) / `## What I owned` (:33); bot-busters `## What I owned` (:22). No shared "hard part / outcome / differently" sections | confirmed |
| D17 | No images/artefacts on any post or project | `grep -rnE '!\[' src/content` = 0 matches; `grep -rcF '```' src/content/blog/*.md` = 0/0/0/0 — **no post has a code fence** | confirmed |
| D18 | `bot-busters.md` is the strongest | It names teammates' work and what he did not build (`bot-busters.md:39-46`) | confirmed |
| D19 | Avatar has no dimensions → layout shift | `index.astro:36` `<img class="w-full h-full object-cover" src="/ava.png" …>` — no `width`/`height`/`aspect-ratio`; `public/ava.png` = 98.5 KB, 256×256 | confirmed |
| D20 | Nav has no mobile treatment | `Nav.astro` contains zero `sm:`/`md:`/`lg:` variants; four links + wordmark on one row (`.astro:12-18`); `grep -cE "sm:|md:|lg:"` = 0 | confirmed |
| D21 | No skip link, no `:focus-visible` | `grep -rn "skip\|focus-visible" src/styles/` = 0 matches | confirmed |
| D22 | No `loading="lazy"` | `grep -rn 'loading="lazy"' src/` = 0 matches | confirmed |

### 2.1 Corrections to the work order

These are recorded so the implementers do not copy a wrong fact into the site.

1. **`Nav.astro` line drift.** `max-w-3xl` is at `Nav.astro:12`, not `:9` (D3).
2. **`dist/` evidence (D13).** `dist/` is a build artefact and is not in the repo, so the
   "confirmed against `dist/`" sentence cannot be reproduced from a clone. Build-time checks in
   §6 use `dist/` after `bun run build`; the diagnosis itself rests on source absence.
3. **Commit-count drift inside research.** `00-index.md:52` says bot-busters has **355** total
   commits; `02-bot-busters.md:274` says **260**. `00-index.md:54` says boloney **1,228**;
   `03-boloney.md:240` says **1,209**. `00-index.md` is the declared ground truth (SOOT-25 §5.1),
   so **cite `00-index.md` for totals** and the per-project file for authorship detail. Never put
   two totals for the same repo on one page.
4. **No research file exists for Olla Finance.** `01-aztec-scan.md:193-197` mentions only that
   the same fleet runs Olla's keeper bot and monitoring, and explicitly leaves Mauro's role
   unanswered (`TODO(mauro)`). The current Olla page therefore rests on `public/cv.md` claims
   (frontend, Go backend, data pipelines, 3-developer team). Treat those as **owner-asserted**,
   not research-evidenced; see §5.5.
5. **Backlog status of new post #4 is 🟡, not 🟢.** `91-content-backlog.md:31` lists "The
   10-minute local development environment" as `🟡 gated — Genericize internals`. SOOT-25 §5.3
   calls its three picks "🟢 ungated". Resolution: write #4 **genericised** (no client name,
   hostnames, account IDs, ARNs, or internal service names beyond the public mechanism). The gate
   is satisfied by the genericisation the work order already mandates. #11 and #13 are 🟢
   (`91:39,41`).
6. **SOOT-25 stage 3 names three implementers (3a/3b/3c); SOOT-26 says two.** §3.8 fixes two
   owners (A and B) and a merge order; content is B's first job because it is the critical path.
7. **`/cv.md` and the footer disagree on contact email.** `public/cv.md:13` lists
   `mauro@eijsenring.com`; the site footer uses `sooth.dev@gmail.com` (`Footer.astro:13`). The
   about page uses the site address only; see §8 Q6.

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
3. **Commit-count drift inside research.** `00-index.md:62` says bot-busters has **355** total
   commits; `02-bot-busters.md:274` says **260**. `00-index.md:63` says boloney **1,228**;
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

---

## 3. File-by-file change list

Every path is relative to the repo root. "AC" is the acceptance criterion the change serves
(§6); "Owner" is the implementer (§3.8). Paths not listed do not change.

### 3.1 Deleted or moved

| Path | Action | Why | AC | Owner |
|---|---|---|---|---|
| `public/ava.png` | **delete** (moved to `src/assets/ava.png`) | `<Image>` needs a pipeline source; `public/` files cannot be resized. Same bytes, same 256 px source. | AC-19, AC-20 | A |
| `src/lib/dates.ts::formatPeriod` | **delete function** | Dead code: zero call sites (`grep -rn formatPeriod src` → 1, the definition). `formatDate` stays. | D7 | A |
| `src/styles/global.css` light palette (`--color-gruvbox-light-*`, 12 vars) | **delete** | Unused (D8); no light mode is in scope. | D7 | A |
| `src/styles/global.css` `--color-gruvbox-bright-*` (7 vars) | **delete** | Byte-identical duplicates of the non-bright vars; only the deleted home page uses them. | D7 | A |
| `src/styles/global.css` animation vars and keyframes (`fadeIn`, `slideUp`, `pulseGlow`, `float`) | **delete** | D1 prohibits them; the replacement motion budget is two events (§3.4). | AC-4 | A |
| `src/pages/index.astro:9-115` hand-rolled shell | **delete** | Replaced by `BaseLayout`; ends the two-shell drift (D5). | D7, AC-7 | A |

No route is removed. No existing slug changes, so **no redirect entries are added**
(`astro.config.mjs` `redirects` stays absent). If an implementer changes a slug despite this,
the same PR adds `redirects: { '/old': '/new' }` and lists it here.

### 3.2 Created

| Path | Purpose | AC | Owner |
|---|---|---|---|
| `src/components/Meta.astro` | One `<head>` block: title, description, canonical, OG (`og:title/description/type/url/image`), `twitter:card`, optional `noindex`. Props: `{ title, description, canonical, ogType, ogImage, noindex? }`. | AC-9, AC-10, AC-12 | A |
| `src/components/Section.astro` | Page band with optional mono eyebrow, `h2`, lede; emits `<section>` with consistent vertical rhythm. Props: `{ id?, eyebrow?, title?, lede?, as? = 'h2' }`. | D3, D5 | A |
| `src/components/ProjectCard.astro` | Numbered card: title, role · period, one-line outcome (`summary`), up to 4 stack chips, status. Props: `{ project: CollectionEntry<'projects'>, rank?: number }`. | D5, AC-8 | A |
| `src/components/PostCard.astro` | Post row/card: date, reading time, title, description, tags, optional project link. Props: `{ post: CollectionEntry<'blog'>, showProject?: boolean }`. | D5, AC-14 | A |
| `src/lib/seo.ts` | `absoluteUrl(path)`, `pageTitle(short)` (appends ` — sooth.dev` only when ≤60 chars), `OG_IMAGE` route-type map. Single source of truth for canonicals and OG paths. | AC-9, AC-10 | A |
| `src/lib/content.ts` | `readingTime(body)` (220 wpm, min 1), `relatedPosts(post, all)` (same `project` first, then shared tag, cap 3), `relatedProjects(project, all)` (shared tag, cap 3). Pure functions, unit-testable. | AC-14, §5.3 | A |
| `src/pages/about.astro` | `/about` route, 400–600 words, five sections (§4.2). | AC-16 | A |
| `src/pages/404.astro` | `/404` route with recovery links, `noindex`, no OG image. | AC-12 | A |
| `src/pages/rss.xml.ts` | RSS 2.0 endpoint over `getCollection('blog')`, absolute links, RFC-822 dates, `description` from frontmatter. Hand-rolled string; no `@astrojs/rss`. | AC-11 | B |
| `src/pages/sitemap.xml.ts` | XML sitemap over static routes + all posts + all projects; absolute URLs; `lastmod` from `updatedDate ?? pubDate` for entries, omitted for static pages. No `@astrojs/sitemap`. | AC-11 | B |
| `public/robots.txt` | `User-agent: * / Allow: /` + `Sitemap: https://sooth.dev/sitemap.xml`. Static, no code. | AC-11 | A |
| `public/og/{home,about,blog,post,projects,project}.png` | Six 1200×630 PNGs, one per page type, ≤35 KB each, authored in stage 2 from rendered HTML at 1200×630. See §3.6. | AC-10 | A (Designer produces) |
| `src/assets/ava.png` | Avatar source for `<Image>`; byte-identical to the deleted `public/ava.png`. | AC-19, AC-20 | A |
| `docs/content-audit.md` | Claim → evidence table for every verifiable sentence on every page (§6 AC-17). Written as content lands, verified by Quality. | AC-17 | B |
| `scripts/verify.mjs` | Dependency-free Node 22 checks: `meta`, `motion`, `layout`, `weight`. Used as AC evidence; not shipped, not a dependency. | AC-4, AC-6, AC-9, AC-19, AC-20 | B |

### 3.3 Modified

| Path | Change | AC | Owner |
|---|---|---|---|
| `astro.config.mjs` | Add `site: 'https://sooth.dev'` only. Keep `vite.tailwindcss`, `server`, `markdown.shikiConfig` (`github-dark`, bundled). No adapter, no integration. | AC-9, AC-10, AC-11 | A |
| `src/styles/global.css` | Replace one-off colours with semantic tokens (§3.4); delete animations; add `:focus-visible`, skip-link, `::selection`, `@media (prefers-reduced-motion: reduce)`, base type; body colours via `var()`. | AC-4, AC-5, AC-7 | A |
| `src/styles/prose.css` | Every colour becomes `var(--color-*)`; body measure `--measure`; code/pre/table/blockquote restyled with tokens; no hex. | AC-5, AC-19 | A |
| `src/layouts/BaseLayout.astro` | Props `{ title, description, width?, ogType?, ogImage?, noindex? }`; render `<Meta>`; skip link; `<main id="main">` with `prose|wide` width; Nav/Footer; keep `<ClientRouter />`. | AC-3, AC-7, AC-9 | A |
| `src/layouts/BlogPost.astro` | Add `body`, `related`, `projectTitle` props; mono metadata row (date · reading time · project); related-items block; prose width. Keep one `h1`. | AC-7, AC-13, AC-14 | B |
| `src/components/Nav.astro` | Five items (Home, Projects, Blog, About, CV); `<details>` disclosure under 640 px with 48 px targets; 44 px desktop targets; `aria-current="page"`; `max-w-5xl`; no `hover:scale`. | AC-6, AC-7 | A |
| `src/components/Footer.astro` | Consistent tokens, links to Email, GitHub, LinkedIn, CV, RSS, source; 44 px targets; no hex/one-off colours. | AC-7 | A |
| `src/pages/index.astro` | Rewrite as five bands (§4.1) on `BaseLayout`; delete shell and all animation classes; `<Image>` avatar with explicit dimensions; 3 curated projects, 3 latest posts. | AC-1, AC-4, AC-8, AC-13 | A |
| `src/pages/blog/index.astro` | One `h1`; lede; `PostCard` list with reading time; RSS link. | AC-8, AC-9 | B |
| `src/pages/blog/[slug].astro` | Pass `post.body`, related items and project title to `BlogPost`. | AC-13, AC-14 | B |
| `src/pages/projects/index.astro` | One `h1`; lede; all five `ProjectCard`s with one-line outcome; no "Featured" badge inside the grid unless it earns hierarchy. | AC-8, AC-13 | B |
| `src/pages/projects/[slug].astro` | `wide` header then `prose` body; artefact rendered inside prose; related posts block; remove the layout/body `h1` duplication (the body heading is removed in content). | AC-13 | B |
| `src/content.config.ts` | **No schema change** — `project`, `featured`, `order`, `status`, `summary` already cover the content plan. Do not add fields. | AC-13 | — |
| `src/content/projects/{aztecscan,okutama,bot-busters,boloney,olla}.md` | Rewrite to §5.2 structure and 600–900 words; delete body `# H1`; trim `summary` to ≤160 chars; correct `featured`/`order` per §8 Q3. | AC-13, AC-17 | B |
| `src/content/blog/{agents-near-production,ci-cd-service-by-service,documentation-drift,parallel-run}.md` | Expand to 1,000–1,500 words; add one artefact each; trim `description` to ≤160 chars; add a "what this cost / what I'd do differently" section. | AC-14, AC-17 | B |
| `src/content/blog/{local-dev-environment,gateway-api-migration,fresh-clone-bugs}.md` | **Create** three posts (backlog #4, #11, #13), 1,200–1,800 words each, complete frontmatter, `project` set where one exists. Slugs are fixed here so RSS/sitemap tests are deterministic. | AC-15 | B |
| `README.md` | Replace the stale "Coming Soon Landing Page" copy (advertises an email form and `tailwind.config.mjs`, neither exists) with the current stack, content workflow and verify commands. | D7 | A |
| `nginx.conf` | **No change expected.** `error_page 404 /404.html` already exists and preserves 404 status. Verified in stage 6 (§9 R2). If a change is needed, it is one line and listed in the PR. | AC-12 | — |
| `package.json` / `bun.lock` | **No change expected.** If a dependency is genuinely added, the same PR installs it, commits `bun.lock`, and states KB cost + rejected alternative in the PR body. | AC-1 | — |

### 3.4 Design tokens (contract; Designer may change values, not names)

`src/styles/global.css` `@theme` keeps the gruvbox primitives and adds these semantic tokens.
Pages and prose consume the semantic names only.

```css
@theme {
  /* surfaces */
  --color-bg:        var(--color-gruvbox-dark-bg);    /* #282828 */
  --color-surface:   var(--color-gruvbox-dark-bg0);   /* #32302f */
  --color-surface-2: var(--color-gruvbox-dark-bg1);   /* #3c3836 */
  --color-border:    var(--color-gruvbox-dark-bg2);   /* #504945 */
  /* text (contrast measured in §11.3) */
  --color-text:        var(--color-gruvbox-dark-fg);  /* #ebdbb2 */
  --color-text-strong: var(--color-gruvbox-dark-fg0); /* #fbf1c7 */
  --color-muted:       var(--color-gruvbox-dark-fg3); /* #bdae93: 5.32 card / 6.77 bg */
  --color-accent:      var(--color-gruvbox-yellow);   /* #fabd2f: 8.69 bg / 6.84 card */
  --color-link:        var(--color-gruvbox-blue);     /* #83a598: 5.48 bg */
  --color-code:        #e0a3b8;                       /* 5.58 on #3c3836 */
  --color-focus:       var(--color-accent);
  /* type scale */
  --text-meta: 0.875rem;
  --text-body: 1.125rem;
  --text-lead: 1.25rem;
  --text-h3: 1.5rem;
  --text-h2: 2rem;
  --text-h1: 2.75rem;
  --text-display: clamp(2.5rem, 6vw, 3.5rem);
  /* space, measure, radius, motion */
  --measure: 68ch;
  --width-wide: 64rem;            /* max-w-5xl */
  --space-section: clamp(3rem, 8vw, 5rem);
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --motion-fast: 150ms;
  --motion-ease: cubic-bezier(0.2, 0, 0, 1);
}
```

Rules: `--color-code` is the only literal added inside `@theme` (there is no gruvbox primitive
that passes on a card); everything else aliases a primitive. No hex outside `@theme`
(AC-5). Body copy uses `max-width: var(--measure)`, never a Tailwind width class.

### 3.5 Motion budget (exactly two events)

1. **View-transition fade** — 150 ms opacity, on ClientRouter navigation, via
   `@view-transition { navigation: auto }` + `::view-transition-old/new(root)`.
2. **Hover/focus colour transition** — 150 ms `color`/`border-color` on links and cards.

`transition: transform` and `transform` on hover are prohibited (`hover:scale` must be gone).
Under `@media (prefers-reduced-motion: reduce)`: `::view-transition-*` animation `none`,
`transition-duration: 0.01ms`, `scroll-behavior: auto` (the current smooth scroll is removed).
Nothing else animates; `document.getAnimations()` after load must be empty except the completed
view transition (AC-4).

### 3.6 OG-image mechanism (no new dependency)

**Decision:** six committed static PNGs, one per page type, selected by route in `src/lib/seo.ts`.
The Designer renders a 1200×630 HTML card in headless Chromium during stage 2 and commits the PNG
to `public/og/`. `Meta.astro` emits `og:image` = `absoluteUrl(OG_IMAGE[kind])` plus
`og:image:width` 1200, `og:image:height` 630, `og:image:alt`.

Rejected alternatives, with the cost that decided it:

| Alternative | Why rejected |
|---|---|
| Build-time generation with `sharp` | `sharp` is only present transitively (`bun.lock:139-173`, via Astro's image service). Importing an undeclared package and its native binary into the `oven/bun` build stage is a silent-breakage risk for zero functional gain. |
| `satori` + `@resvg/resvg-js` | Two new dependencies (roughly 1–2 MB installed), a WASM/native binary, and a font file to satisfy the renderer. Violates "no new dependency without a stated KB cost" for an image that changes once a year. |
| SVG OG images | Twitter/X and most scrapers do not render SVG `og:image`; the card would be blank where it matters most. |
| Per-entry OG images | Requires either the rejected generator or a hand-made PNG per post (7→13 files). AC-10 asks per page type; per-entry is a stage-2 design nice-to-have, not a gate. |

### 3.7 Frozen interfaces (so A and B can work in parallel)

```ts
// src/lib/seo.ts
export type OgKind = 'home' | 'about' | 'blog' | 'post' | 'projects' | 'project';
export const OG_IMAGE: Record<OgKind, string>;
export function absoluteUrl(path: string): string;
export function pageTitle(short: string): string;      // "X — sooth.dev" iff ≤60 chars

// src/lib/content.ts
export function readingTime(body: string): number;      // whole minutes, ≥1
export function relatedPosts(post: CollectionEntry<'blog'>,
  all: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[];   // ≤3
export function relatedProjects(project: CollectionEntry<'projects'>,
  all: CollectionEntry<'projects'>[]): CollectionEntry<'projects'>[]; // ≤3

// src/layouts/BaseLayout.astro
interface Props {
  title: string; description: string;
  width?: 'prose' | 'wide';            // default 'prose'
  ogType?: 'website' | 'article';      // default 'website'
  ogImage?: string;                    // root-relative; default by route
  noindex?: boolean;
}

// src/components/Section.astro
interface Props { id?: string; eyebrow?: string; title?: string; lede?: string; as?: 'h2' | 'h3' }
```

B may rely on these exactly; B must not edit `src/lib/*`, `BaseLayout.astro`, `Meta.astro` or
`global.css`/`prose.css`. If an interface must change, B proposes it in the PR and A lands it
first.

### 3.8 Build ownership and merge order

Two implementers, because content is the critical path and the shell is the other half.

**Implementer A — shell, system, home, about, 404.** Owns: `src/styles/*`, `src/lib/*`,
`src/components/{Meta,Section,ProjectCard,PostCard,Nav,Footer}.astro`,
`src/layouts/BaseLayout.astro`, `src/pages/{index,about,404}.astro`, `public/og/*`,
`public/robots.txt`, `src/assets/ava.png`, `astro.config.mjs`, `README.md`.

**Implementer B — templates, machine surface, all content.** Owns:
`src/layouts/BlogPost.astro`, `src/pages/blog/**`, `src/pages/projects/**`,
`src/pages/rss.xml.ts`, `src/pages/sitemap.xml.ts`, all files under `src/content/**`,
`docs/content-audit.md`, `scripts/verify.mjs`.

**Order.** Both branch from `main` @ the spec merge point. B starts with `src/content/**` and
`docs/content-audit.md` immediately (no shared files). A lands the shell first. B rebases, then
lands templates + endpoints. Rationale: B's route templates import A's components, so A's
component files must exist before B's build is green; content has no such dependency and is the
longest job. If Foreman splits stage 3 three ways per SOOT-25, 3c = B's `src/content/**` +
audit, 3b = the rest of B, 3a = A.

No other agent touches these files. Neither owner edits `public/cv.md` / `public/cv.pdf`,
`nginx.conf` (unless AC-12 fails), `Dockerfile*`, or `docker-compose.yml`.

---

## 4. Content outline per route (D5)

Each band answers exactly one question, in this order. Copy is the Implementer's; the *claim* and
its evidence are fixed here. Word counts exclude frontmatter and code blocks unless stated.

### 4.1 `/` — home

| # | Band | Answers | Content contract |
|---|---|---|---|
| 1 | Hero | *Who is this and what do they do?* | `h1` = "Mauro Eijsenring". One-line role: "I build and run the platform behind the product — Kubernetes, CI/CD, and lately the guardrails that let AI agents near production." Availability line: single sentence, availability not objective (§8 Q4). Avatar via `<Image>`, 96 px, explicit dimensions, `fetchpriority="high"`, not lazy. No animation. |
| 2 | Proof strip | *Is any of this verifiable?* | Three mono facts, each a number + noun + source: **678 commits / 1,812** on Aztecscan (`00-index.md:58`); **40 PRs** on a client Kubernetes platform (`00-index.md:66`); **70 deploys/month** at the July peak (`04-okutama.md:226`). No percentage claims, no uptime. |
| 3 | Selected work | *What has he shipped?* | Three `ProjectCard`s: Aztecscan, The Grid, Bot Busters (§8 Q3). Each card carries a one-line **outcome**, not a stack dump: e.g. "CI/CD and manifests for a production block explorer — 9 services, 3 live networks." |
| 4 | Latest writing | *Can he explain the work?* | Three newest `PostCard`s with date, reading time, title. Link to `/blog`. |
| 5 | Contact | *How do I hire or reach him?* | Email (`sooth.dev@gmail.com`), GitHub, LinkedIn, CV (`/cv.pdf`), About. One line: what he is available for. |

### 4.2 `/about`

Five sections, 400–600 words, first person, no life story.

| # | Section | Answers |
|---|---|---|
| 1 | Opening | Who Mauro is as an engineer, in one paragraph: platform/infrastructure + full-stack, ~5 years shipping, currently freelance. |
| 2 | The arc | What the projects add up to: Aztecscan (scale, protocol churn) → The Grid (serverless → Kubernetes) → Bot Busters/Boloney (realtime state machines). Concrete nouns, project links. |
| 3 | How I work | Decision records, parallel-run migrations, review, AI-agent guardrails. Three short paragraphs, each tied to a real artefact (ADR-0008, `docs/ci-cd-migration.md`, MCP server). |
| 4 | Availability | What he takes on (platform/infrastructure/full-stack, contract or freelance). Wording: availability, not a CV objective. |
| 5 | CV + contact | Links to `/cv.pdf`, `/cv.md`, email, GitHub, LinkedIn. No address, phone, birthday, nationality. |

### 4.3 `/blog`

1. `h1` "Writing" + lede: what the posts are about (infrastructure, migrations, AI agents near
   production).
2. Chronological list, newest first: `PostCard` (date, reading time, title, one-sentence
   description, tags, project link).
3. RSS link (`/rss.xml`) with the feed icon as text or inline SVG.

### 4.4 `/blog/[slug]`

1. Header: `h1`, description as lede, mono row = date · reading time · project link · tags.
2. Body, in this order: **thesis** (what changed / what I claim) → **mechanism** (how it works,
   with the artefact) → **evidence** (commit/PR/command/output) → **tradeoff / what it cost** →
   **what to steal or what I'd do differently**. These are section semantics, not literal `h2`
   text for every post; each post must visibly contain all five.
3. Related: 2–3 items (project page first, then posts sharing a tag).

### 4.5 `/projects`

1. `h1` "Projects" + lede: the shape of the work (prototypes → platforms).
2. All five, featured first then `order`: `ProjectCard` with one-line outcome, role · period,
   ≤4 stack chips, status label. Five is deliberate — this is the index; curation happens on `/`.
3. Contact line for work enquiries.

### 4.6 `/projects/[slug]`

Header (outside prose): `h1` title, role · period, stack chips, repo/live links, status.
Body: exactly the six sections of §5.2, in order, 600–900 words:

1. **The problem** — what was broken, for whom (2–3 sentences, no preamble).
2. **My role and what I owned** — evidence: PR numbers, files, commit counts; name what a
   teammate built.
3. **The hard part** — one decision, rejected alternatives, accepted tradeoff, cost.
4. **Outcome** — verifiable facts only (shipped, still running, replaced X, N services).
5. **What I'd do differently** — one honest paragraph (optional per §5.2, strongly preferred;
   if absent, the page must still have the other five).
6. **Artefact** — one diagram, screenshot, `pre` of a real manifest/snippet + real output, or a
   table. Illustrative-only images do not count. Placed next to §3 or §4.

Then: related posts (by `project:`), and a link to `/projects`.

### 4.7 `/404`

1. `h1` "That page doesn't exist" + one line explaining the link may be old.
2. Four recovery links: Home, Projects, Blog, About. Status 404 from nginx (AC-12).
3. `noindex`, no OG image, no JS.

---

## 5. Per-project content plan

Structure is fixed (§4.6). Word target 600–900. The table gives the **proposed evidence anchors**
for each section. An anchor is valid only if it exists at the cited location; each was checked on
2026-10-27. Where research cannot evidence a claim, the row says **GAP** and gives the weaker
claim to ship instead. Content must not exceed what the anchor supports.

### 5.1 Aztecscan — `aztecscan.md`

| Section | Claim to make | Anchor |
|---|---|---|
| Problem | A privacy L2 needs a block explorer that keeps up with a protocol that changes constantly; five environments and three live networks. | `01-aztec-scan.md:12-22`, `:342-345` |
| Role | Second contributor, 678 of 1,812 commits (~37%), 133 authored / 128 merged PRs. Owned per-service CI/CD, production k8s manifests, the CI/CD migration, AI-agent tooling. NOT the project lead; NOT the DB schema (Filip's); NOT the `/l2/tips` canary. | `00-index.md:58,66`; `01:37-61` |
| Hard part | Migrating Skaffold → GitHub Actions + Kustomize service by service, no freeze, `explorer-ui-v2` as live pilot; the `nameSuffix`/`HTTPRoute.backendRefs` footgun that silently routes traffic to a dead service. | `01:115-134`, `:49`, `:350`; PR #625 |
| Outcome | 9 services with their own Dockerfile, 11 shared packages, 5 environments, PR #625 (+4,925 / 79 files). | `01:342-345`, `:350` |
| Differently | The migration doc (`docs/ci-cd-migration.md`, 459 lines) documented the two footguns after they bit; write the overlay invariant down before the first service. | `01:127-134`, `90:73` |
| Artefact | `pre` block: the Kustomize `nameSuffix` + `HTTPRoute` backendRef pair showing the name that must be hardcoded, plus the one-line `kubectl kustomize` output that proves it. Sanitise hostnames. | `01:129-131`; `docs/ci-cd-migration.md` in repo |
| **GAP** | Any scale metric (blocks indexed, API requests/day, websockets) is **not in git**. Do not invent one. The "~30k Kafka round trips" figure is your own commit message (`01:354`, marked CLAIMED) — either attribute it ("the commit message recorded ~30k") or drop it. | `01:354-358` |

### 5.2 The Grid / Okutama — `okutama.md` (`status: private`)

| Section | Claim to make | Anchor |
|---|---|---|
| Problem | A client platform was a set of unmanaged AWS Lambda functions and App Runner services with no environment separation; no repeatable deploy path. | `04-okutama.md:17-28`, `:44-68` |
| Role | Founded the repo (`80a117e`), 342 of 1,963 commits, 40 PRs. Owned bootstrap + first prod deploy, `user-management-api`, `media-management-api`, the Go/Python → Kubernetes integration (PR #17, +37,766/−80, 196 files), nginx → Envoy Gateway in all 3 envs, Grid MCP Server Phase A (#495–#502). NOT the UPS build (Oleg), NOT Aurora schema (Hugo), NOT the final nginx decommission (Oleg). | `04:70-95`; `00-index.md:61,66` |
| Hard part | Three-tier Kubernetes (EKS / K3s staging / Minikube local) and moving ingress to Gateway API one environment at a time, leaving the old path running ~10 weeks. Tradeoff: staging cannot rehearse an EKS control-plane upgrade. | `04:81`, `:189-199`, `:433`; `90:57` |
| Outcome | 12 services, 8 ADRs, ~35 design docs; deploy frequency 6/month (Jan) → 70/month (Jul peak); local stack cold start ~10 min. | `04:427-432`, `:438`; `:237-242` |
| Differently | Architecture docs said `t3.medium` and Hetzner; reality was `t3.large` on EC2. Re-verify against the live account before pricing a decision. | `04:201-206`; `90:92-103` |
| Artefact | A **sanitised** before/after table (Lambda + App Runner → EKS + ArgoCD + Envoy Gateway) and the sync-wave order of the ArgoCD kustomization. No account IDs, ARNs, hostnames, or ECR token (explicit warning at `04:257-258`). | `04:187-214`, `:256-258` |
| **GAP** | Cost figures (ADR-0008) need client sign-off; **omit entirely** (§8 Q7). ADR-0008 was never merged (`04:387-392`) — write "I proposed and defended the sequencing", not "we did it". Client naming unresolved (`04:483-486`) — default "a Web3 data platform" until Mauro says otherwise. |

### 5.3 Bot Busters — `bot-busters.md`

| Section | Claim to make | Anchor |
|---|---|---|
| Problem | A realtime social-deduction game where players hunt LLM impostors; build phase, Oct 2023 – Feb 2024. Needs server-authoritative match state, fair votes, and scoring that decides who actually fooled whom. | `02-bot-busters.md:10-21`, `:278` |
| Role | Third contributor (44 commits / 43 PRs of 254). Owned `match.ts` (13 commits, top file), achievements (8 of 9), vote/scoring, DB access extraction (#64), match-history join table (#171), profanity filter, anonymous + wallet auth, message cap (#291). NOT the bot AI (Ramiro, 0 commits), NOT the DB schema alone, NOT the Aleo/Coinbase payout system. | `02:42-81`; `00-index.md:62` |
| Hard part | Hiding `isBot` until the results stage: `toSerializable()` strips the flag from every outbound payload, while identities come from one shuffled pool so identity cannot out a bot. Tradeoff: server-authoritative secrecy costs a serialisation pass and a revealed-at-the-end state. | `02:86-106` |
| Outcome | Shipped build-phase game; 8 achievements over PRs #143→#307; one `match.ts` state machine driving chat → voting → results. | `02:112-119` |
| Differently | One test file repo-wide and a CI deploy with no test gate; the game-state machine was the one thing that needed tests. | `02:284-285` |
| Artefact | Phase table: chat 3 min / voting 30 s / splash 6.5 s / hard TTL 10 min, 1–3 bots capped at `min(3, PLAYERS_PER_MATCH)`; plus the `toSerializable()` contract described in one `pre` block. | `02:88-99`, `:288-289` |
| **GAP** | Players, matches/day, uptime, inference cost: not visible from source (`02:290-291`). Do not cite them. The 7-model/4-provider roster belongs to Ramiro's work — mention as context only, never as Mauro's build. | `02:65-69`, `:283` |

### 5.4 Boloney! — `boloney.md`

| Section | Claim to make | Anchor |
|---|---|---|
| Problem | A multiplayer Liar's Dice game showcasing Aleo ZK proofs; the game needs auth, wallet identity, a match loop and turn timers before any proof layer can plug in. | `03-boloney.md:9-20`, `:22-47` |
| Role | 87 of 1,209 commits (~7%), mid-pack. Owned Nakama match state machine generations 1–2, timer service (AFK auto-resolution), notifications, six power-ups full-stack, Aleo wallet auth built twice, 3D dice rendering/audio. ZK circuits/proofs: **not his** (1 of 107 commits in the sibling repo). | `03:59-89`; `00-index.md:63` |
| Hard part | Keeping a realtime match moving without a disconnected player: per-stage timeouts (30 s) and 60 s turns, then `handleOutOfTime` auto-rolls, force-advances, or forfeits the turn. Tradeoff: server authority over every dice roll costs a timer per stage and a deterministic recovery path. | `03:98-113` |
| Outcome | Two generations of the match loop shipped (`44a6389a` → `91372108` → `f8d932e7`); six power-ups; game ran on stock Nakama 3.13.1 with a Rollup-bundled runtime. | `03:94-106`, `:73-77` |
| Differently | The fake RNG (public `randomnumberapi.com`) lived in the codebase twice and was deleted nine months apart as real ZK integration landed — honest, small, worth telling. | `03:52-55` |
| Artefact | Stage/timeout table (power-up, dice-roll, round-summary 30 s; player turn 60 s) plus the state list (`lobbyStage` → `getPowerUpStage` → `rollDiceStage` → `playerTurnLoopStage` → `roundSummaryStage` → `endOfMatchStage`). | `03:98-113` |
| **GAP** | No GitHub PRs for any author (squash/fork workflow; `03:250`) — cite commit SHAs, not PRs. No production numbers (`03:253-255`). The current third-generation `stage-handlers.ts` split is not confirmed his (`03:105-106`) — describe it as the team's later refactor. | `03:250-255` |

### 5.5 Olla Finance — `olla.md`

| Section | Claim to make | Anchor |
|---|---|---|
| Problem | Liquid staking for the Aztec privacy L2 needs a user-facing staking UI plus backend services and pipelines that keep staking data accurate. | `public/cv.md:60-64` (owner-asserted) |
| Role | Frontend (`ollafinance/olla-ui`) + Go backend services + data pipelines, in a 3-developer team; ran on the same Kubernetes platform design as the explorer but isolated from it. Evidence available today: **70 commits** by `Mautjee` in `ollafinance/olla-ui` (GitHub API, `author=Mautjee`, 2026-10-27); org repos include `olla-butler` and `staking-dashboard`. | `public/cv.md:60-64`; GitHub API count; `01-aztec-scan.md:193-197` |
| Hard part | **GAP** — research has no Olla deep-dive and no specific decision is evidenced. Weaker honest claim: "the platform was deliberately the same design as the explorer but isolated, so a second product ran on hardware that already existed." | `public/cv.md:60-64`; `01:193-197` |
| Outcome | Shipped liquid-staking product on the shared platform. Do **not** claim users, TVL, uptime or audit outcomes. | `public/cv.md:60-64` |
| Differently | **GAP** — omit rather than invent. | — |
| Artefact | **GAP** — no verified snippet. Omit the artefact for this page rather than shipping a generic one; note the omission in the PR. | — |
| **GAP** | No `05-olla.md` exists. The 3-developer team, Go backend and pipeline claims are owner-asserted in `cv.md`, not research-evidenced. The page must not present them as audited facts. If Mauro can supply a repo/PR, the anchor replaces the weaker claim. See §8 Q5. | — |

### 5.6 Post plan

Four existing posts, expanded in place (1,000–1,500 words), one artefact each:

| Slug | Thesis (keep) | Artefact to add | Anchor |
|---|---|---|---|
| `agents-near-production` | An agent needs conventions in writing, a governed data path, and a human interlock before it touches production. | `pre` block: a trimmed skill-list / MCP auth chain (sanitised). | `90:11-45`; `04:332-359` |
| `ci-cd-service-by-service` | Migrate one service at a time with the old pipeline still deploying the rest; the Kustomize footgun is the lesson. | `pre`: `nameSuffix` + `HTTPRoute.backendRefs` mismatch, with the failing route as output. | `01:115-134`; `91:37` |
| `documentation-drift` | Docs drift from live platforms; re-verify against the account before you price a decision. | Before/after table of the three stale facts (`t3.medium`→`t3.large`, Hetzner→EC2, Tern→hand-rolled). | `04:201-206`; `90:92-103` |
| `parallel-run` | Never big-bang a migration; leave the old path until the new one is proven. | Timeline with the ~10-week gap between Envoy cutover and nginx removal, and the `-deprecated` manifest sets still present. | `90:48-65`; `04:433`; `91:36` |

Three new posts, exact slugs and sources:

| # | Slug | Title | Words | Project | Evidence |
|---|---|---|---|---|---|
| 4 | `local-dev-environment` | The 10-minute local development environment | 1,200–1,800 | `okutama` | `04:237-245`; `91:25` (🟡 — genericise: no client, hostnames, ARNs, account IDs, internal service names beyond the public mechanism) |
| 11 | `gateway-api-migration` | Migrating ingress to the Gateway API | 1,200–1,800 | `okutama` | `04:81`, `:128-144`; `91:39` (🟢) |
| 13 | `fresh-clone-bugs` | Three bugs a fresh clone found that code review didn't | 1,200–1,800 | `aztecscan` | `90:174`; `91:41` (🟢) — FK ordering violation, silent duplicate block write, frontend Zod wire-format mismatch; PR #364 |

Every post: `description` ≤160 chars, reading time in the header, 2–3 related links, and a
tradeoff or "what this cost" section. No post may cite a gated backlog item (§7).

### 5.7 `/about` source map

| Section | Source |
|---|---|
| Opening | `public/cv.md:1-3` (role, location), `90:183-192` (the one-sentence arc). |
| Arc | `00-index.md:38-46` (project table), `90:48-65`, `90:128-145`. |
| How I work | `90:11-45` (agent guardrails), `90:69-88` (decision records), `90:92-103` (drift), `90:48-65` (parallel-run). |
| Availability | §8 Q4 wording. |
| CV + contact | `public/cv.md`, `/cv.pdf`, `sooth.dev@gmail.com`. No address/phone/birthday/nationality. |

Do not copy `90-cross-cutting.md` prose into the page; use it as the fact base and write fresh
copy. Quote at most one short phrase as evidence in the issue, never in `public/`.

---

## 6. Testable acceptance criteria

All commands run from the repo root **inside the build sandbox**
(`ssh -p 2222 -i ~/.ssh/vps_ed25519 agent@127.0.0.1`), which has node 22, bun and chromium.
`$BASE=http://localhost:4321` is `bun run preview` (or `bun run dev`); `$SITE=https://sooth.dev`
is the live check for the Verifier. Every pass condition is a command result, never "looks good".
Paste the command and its real (trimmed) output in the PR and the issue.

Helper: `scripts/verify.mjs` is dependency-free and exposes exactly these subcommands; it exits
non-zero on the first violated assertion so it can gate CI. Implementers may not weaken them.

```
node scripts/verify.mjs meta   <dist-dir>
node scripts/verify.mjs motion <url...>
node scripts/verify.mjs layout <url...> --width <px> [--keyboard]
node scripts/verify.mjs shots  <base-url> <out-dir>
node scripts/verify.mjs weight <dist-dir> <public-dir>
node scripts/verify.mjs audit  <docs/content-audit.md>
```

### Build & correctness

**AC-1 — clean build, lockfile honest.**
```bash
bun install --frozen-lockfile && bun run build; echo "exit=$?"
git diff --exit-code -- bun.lock; echo "lock=$?"
```
Pass: `exit=0`, `lock=0`, `dist/` contains `index.html`, `404.html`, `rss.xml`,
`sitemap.xml`, `about/index.html`, `blog/index.html`, `projects/index.html` and one directory per
entry (7 posts, 5 projects). If a dependency was added, `bun.lock` is in the same commit and the PR
body states installed KB and the rejected alternative.

**AC-2 — existing URLs still resolve.** Split by URL family so one failure names the route.
```bash
# AC-2a content routes (200, no redirect chain longer than 1)
for u in / /blog /blog/agents-near-production /blog/ci-cd-service-by-service \
         /blog/documentation-drift /blog/parallel-run /projects \
         /projects/aztecscan /projects/boloney /projects/bot-busters \
         /projects/okutama /projects/olla; do
  printf '%s ' "$u"; curl -s -o /dev/null -w '%{http_code} %{num_redirects}\n' "$SITE$u"
done
# AC-2b CV artefacts (200 + correct type; PDF must download)
for u in /cv.pdf /cv.md; do printf '%s ' "$u"; curl -sI "$SITE$u" | grep -iE '^HTTP|^content-type|^content-disposition'; done
```
Pass: every content route `200 0`; `/cv.pdf` `200` with `application/pdf` and
`content-disposition: attachment`; `/cv.md` `200` (`text/markdown` or `text/plain`). No redirect
entries exist, so `num_redirects` must be 0.

**AC-3 — no JS dependence, ≤15 KB JS.**
```bash
grep -rn "<script" src/ ; echo "authored-scripts=$?"            # expect: no output, exit 1
find dist/_astro -name '*.js' -print0 | xargs -0 -r gzip -c | wc -c   # bytes, gzipped
chromium --headless --no-sandbox --blink-settings=scriptEnabled=false \
  --dump-dom "$BASE/blog/parallel-run" | sed -n 's/.*<main[^>]*>//p' | wc -c
```
Pass: no authored `<script>`; total JS ≤15360 bytes gzipped; the JS-disabled `innerText`/DOM dump
contains the post title and the first body sentence. Record the byte count in the PR.

**AC-4 — motion budget, reduced-motion honoured.**
```bash
grep -rnE "animate-(pulse-glow|float|slide-up)|hover:scale|animate-bounce|animate-pulse" src/ ; echo "banned=$?"
node scripts/verify.mjs motion "$BASE/" "$BASE/projects/aztecscan/" "$BASE/blog/parallel-run/"
```
Pass: `banned=1` (no matches); the script (CDP `Emulation.setEmulatedMedia` with
`{name:'prefers-reduced-motion',value:'reduce'}`) reports `getAnimations().length = 0` and every
`transitionDuration ≤ 10ms` on all three URLs. Without the override, at most two distinct
transition/animation events are observed (§3.5), each ≤200 ms, none on `transform` except the
view-transition pseudo-element. Paste both runs.

**AC-5 — tokens only.**
```bash
awk '/@theme[[:space:]]*\{/{t=1} t&&/^\}/{t=0;next} !t&&/#[0-9a-fA-F]{3,8}/{print FILENAME":"FNR":"$0}' src/styles/*.css
grep -c "var(--color-" src/styles/prose.css
grep -c "var(--color-" src/pages/*.astro src/pages/*/*.astro | grep -v ':0' | wc -l
```
Pass: first command prints nothing; `prose.css` has ≥10 token references; no page uses a literal
palette class (`bg-gruvbox-*`, `text-gruvbox-gray`, `border-gruvbox-*`) — `grep -rn "gruvbox-"
src/pages src/components` must be 0 except `src/styles/global.css`.

### Design

**AC-6 — mobile nav and no horizontal scroll.**
```bash
for w in 360 768 1280; do node scripts/verify.mjs layout "$BASE/" "$BASE/projects/" "$BASE/blog/" "$BASE/about/" --width "$w"; done
```
Pass per width: `document.documentElement.scrollWidth <= window.innerWidth`; every `a`, `button`,
`summary` in the nav is ≥44×44 CSS px; at 360 the menu control is visible, clicking it exposes all
five links, and one link click navigates. Script prints `scrollWidth/innerWidth` and the smallest
target size. Paste the 360 output.

**AC-7 — keyboard, focus, one h1.**
```bash
node scripts/verify.mjs layout "$BASE/" "$BASE/projects/" "$BASE/blog/" "$BASE/about/" --width 1280 --keyboard
node scripts/verify.mjs meta dist   # includes h1 count per page
```
Pass: first Tab focuses the skip link and it becomes visible; skip link targets `#main`; the
scripted Tab sequence reaches nav → first main link/content → footer with no cycle (20 Tabs, no
repeated activeElement before the footer); every focused element matches `:focus-visible` and has
an outline/border with ≥3:1 contrast against its background (script computes it; the token pair is
8.69:1 on `--color-bg`); every built page has exactly one `<h1>`.

**AC-8 — screenshots at three widths.**
```bash
node scripts/verify.mjs shots "$BASE" docs/evidence/screens
```
Produces 18 full-page PNGs (6 routes × 3 widths): `/`, `/blog`, `/blog/parallel-run`, `/projects`,
`/projects/aztecscan`, `/about`. Attach them (or a zip) to the issue. Pass: files exist, each
>10 KB, dimensions match the requested width, and the desktop screenshots show the wide layout
(`max-w-5xl`) while post/prose pages are narrower.

### Discoverability

**AC-9 — metadata on every route.**
```bash
node scripts/verify.mjs meta dist
```
Pass per built HTML file: exactly one `<title>` of 1–60 chars; one `<meta name="description">` of
1–160 chars; `<link rel="canonical">` absolute and equal to `https://sooth.dev` + route (no
trailing slash except `/`); `og:title`, `og:description`, `og:type`, `og:url`, `og:image`
(absolute), `og:image:width=1200`, `og:image:height=630`, `twitter:card` present; all titles
unique; home title does not contain "Links". Script prints a table and exits non-zero on any
missing/over-length field.

**AC-10 — OG image fetchable and correct.**
```bash
for k in home about blog post projects project; do
  printf '%s ' "$k"; curl -sI "$SITE/og/$k.png" | grep -iE '^HTTP|^content-type|^content-length'
done
node -e 'const fs=require("fs");for(const k of ["home","about","blog","post","projects","project"]){const b=fs.readFileSync(`public/og/${k}.png`);if(b.toString("ascii",1,4)!=="PNG")throw k;console.log(k,b.readUInt32BE(16)+"x"+b.readUInt32BE(20),b.length+"B")}'
```
Pass: every response `200` + `image/png`; every file is PNG **1200×630**, ≤35 KB; the page's
`og:image` resolves to the mapped file (§3.6) and `og:image:alt` is non-empty.

**AC-11 — sitemap, robots, RSS.**
```bash
python3 -c "import xml.dom.minidom as m; m.parse('dist/sitemap.xml'); m.parse('dist/rss.xml'); print('xml ok')"
grep -c "<item>" dist/rss.xml
grep -o "<loc>[^<]*</loc>" dist/sitemap.xml | wc -l
grep -E "Sitemap:" dist/robots.txt
grep -c "<link>https://sooth.dev/blog/" dist/rss.xml
```
Pass: `xml ok`; RSS has **7** `<item>`; sitemap has **16** `<loc>` (2 index + 2 static + 7 posts
+ 5 projects; `/404` excluded); robots references `https://sooth.dev/sitemap.xml`; all 7 RSS
`<link>` values are absolute live URLs; RSS `<pubDate>` parses as RFC-822.

**AC-12 — 404 route served as 404.**
```bash
curl -s -o /tmp/404.html -w '%{http_code}\n' "$SITE/no-such-page-$(date +%s)"
grep -oE 'href="/(projects|blog|about)?"' /tmp/404.html | sort -u | wc -l
curl -s -o /dev/null -w '%{http_code}\n' "$SITE/404.html"
```
Pass: first code `404` (not 200); body contains ≥4 internal links (Home, Projects, Blog, About)
and the text "doesn't exist"; direct `/404.html` returns `404` because nginx marks it `internal` —
that is expected, not a failure.

### Content

**AC-13 — project structure and length.**
```bash
for f in src/content/projects/*.md; do
  printf '%s words=' "$f"; awk 'c>=2{print}' "$f" | wc -w
  grep -nE '^## (The problem|My role|The hard part|Outcome|What I.d do differently|Artefact)' "$f" | wc -l
done
grep -c '^# ' src/content/projects/*.md          # must be 0 for every file
for f in dist/projects/*/index.html; do printf '%s h1=' "$f"; grep -o '<h1' "$f" | wc -l; done
```
Pass: each body 600–900 words; each file has the five required section headings (artefact is a
`##` only where §5 marks one; Olla's GAP means the artefact is absent — note it in the PR); zero
body `# H1`; exactly one `<h1>` in every built project page.

**AC-14 — posts length, artefact, tradeoff.**
```bash
for f in src/content/blog/*.md; do printf '%s words=' "$f"; awk 'c>=2{print}' "$f" | wc -w; done
grep -c '^\s*```' src/content/blog/*.md                 # ≥2 per post (fence open+close)
grep -lE '^## .*(tradeoff|what this cost|what I.d do differently)' src/content/blog/*.md | wc -l
```
Pass: the four existing posts are 1,000–1,500 words; every post has a fenced block (≥2 fences)
rendered as `<pre>` in `dist/blog/*/index.html`; every post has a tradeoff/cost section; every post
states a thesis in its first two paragraphs (reviewer checks against `docs/content-audit.md`).
The three new posts are checked by AC-15 at 1,200–1,800.

**AC-15 — three new posts, no gated content.**
```bash
ls src/content/blog | sort
for f in src/content/blog/{local-dev-environment,gateway-api-migration,fresh-clone-bugs}.md; do
  printf '%s ' "$f"; awk 'c>=2{print}' "$f" | wc -w
done
grep -rniE '\$360|serverless sprawl|30,000 database|three networks on three protocol|reviewing my own decision' src/content/blog/ ; echo "gated=$?"
```
Pass: 7 files; each new post 1,200–1,800 words and complete frontmatter (the build's Zod schema is
the check); `gated=1` (no gated idea copied); every new post has `description` ≤160 and 2–3 related
links in the rendered page.

**AC-16 — about page.**
```bash
node -e 'const h=require("fs").readFileSync("dist/about/index.html","utf8");const m=h.match(/<main[\s\S]*?<\/main>/)[0];console.log(m.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).length)' 
grep -c 'href="/cv.pdf"' dist/about/index.html
grep -ciE 'den haag|nationality|phone|birthday|born|\+31|mauro@eijsenring' dist/about/index.html
```
Pass: 400–600 words of body copy; `/cv.pdf` linked; private-detail scan `0`; the page reaches
`mailto:sooth.dev@gmail.com`, GitHub, LinkedIn; one `h1`.

**AC-17 — factual audit artifact.**
```bash
test -s docs/content-audit.md && node scripts/verify.mjs audit docs/content-audit.md
```
Pass: the file has one section per route and per project/post slug; every verifiable claim row has a
non-empty evidence cell matching `research/…:\d+`, `owner/repo#\d+`, or a 7–40 char commit SHA; every
`GAP` in §5 appears as an explicit "not claimed / softened to …" row. Quality Reviewer re-checks
each row against the cited source and attaches the verdict; a row that does not match its source
fails the stage.

### Performance (mobile, the way Mauro reads it)

**AC-18 — Lighthouse thresholds.**
```bash
for u in / /blog/parallel-run /projects/aztecscan; do
  n=$(echo "$u" | tr '/' '_'); npx --yes lighthouse "$BASE$u" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path="docs/evidence/lh${n}.json" \
    --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet
  node -e 'const j=require(process.argv[1]);for(const [k,v] of Object.entries(j.categories))console.log(k,Math.round(v.score*100))' "docs/evidence/lh${n}.json"
done
```
Pass per URL: performance ≥95, accessibility 100, best-practices ≥95, SEO 100. Paste scores and
paths. `npx lighthouse` is a run-time tool only; it is not added to `package.json`.

**AC-19 — Core Web Vitals + image attributes.**
From the same JSON:
```bash
node -e 'for(const f of process.argv.slice(1)){const j=require(f);const a=j.audits;console.log(f,{cls:a["cumulative-layout-shift"].numericValue,lcp:a["largest-contentful-paint"].numericValue,tbt:a["total-blocking-time"].numericValue})}' docs/evidence/lh*.json
grep -o '<img[^>]*>' dist/index.html dist/blog/*/index.html dist/projects/*/index.html
```
Pass: CLS <0.05, LCP <2500 ms, TBT <200 ms (Lighthouse mobile preset = simulated Slow-4G); every
`<img>` has `width`+`height` (or `style="aspect-ratio"`), the hero avatar has no `loading="lazy"`,
and every below-fold image has `loading="lazy"`.

**AC-20 — page weight and public budget.**
```bash
node scripts/verify.mjs weight dist public
find public -type f -size +100k -printf '%s %p\n'
find dist/_astro -name '*.css' -print0 | xargs -0 -r gzip -c | wc -c
```
Pass: every route's HTML+CSS (gzipped, separately summed) ≤122880 bytes; first-view payload
(HTML+CSS+JS+fonts+above-fold images, excluding `/cv.pdf` and the avatar source) ≤256000 bytes;
**no file in `public/` >102400 bytes** (currently `public/cv.pdf` = 80.8 KB is the largest; the
98.5 KB avatar is moved to `src/assets/` and served as a responsive set); CSS ≤60 KB gzipped; the
script prints a per-route table.

---

## 7. Out of scope (drift guard)

Restated from §1 so a reviewer can reject a PR that wanders:

| Do not build | Detect it |
|---|---|
| CMS, comments, newsletter, contact form | new dependency, `/api/*`, form action, `mailto` only |
| Analytics, tracking, cookie banner, A/B tooling | any `<script src=…>` beyond Astro's router, any `gtag`/`plausible`/`umami` string |
| i18n / Dutch version | `src/i18n`, locale routing, `lang="nl"` |
| Client-side framework/router/animation lib/CSS-in-JS | new `react`, `vue`, `svelte`, `framer-motion`, `gsap`, `styled-components` in `package.json` |
| UI kit, icon pack, web font | new `@radix`, `lucide`, `heroicons`, `.woff2` in `public/` or `@font-face` |
| CV content rewrite | any diff to `public/cv.md` / `public/cv.pdf` |
| DNS, domain, hosting, other Dokploy projects | any change outside the sooth.dev app, any DNS record change |
| Redirect maps beyond kept URLs | `redirects` in `astro.config.mjs` not listed in §3.1 |
| New writing on gated backlog items #2, #3, #5, #6, #7, #12, #14, #15 | AC-15 grep; reviewer reads `91-content-backlog.md` status column |
| New dependency for OG/RSS/sitemap | `package.json` diff; §3.6 is the only approved mechanism |
| Downgrading Astro or replacing the content layer | `package.json`/`src/content.config.ts` diff; §9 R1 |

What may change beyond the file list: nothing. If an implementer believes a file outside §3 must
change, they state why in the PR before changing it.


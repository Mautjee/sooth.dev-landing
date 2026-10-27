---
issue: SOOT-27
parent: SOOT-25
spec: docs/spec-portfolio-v2.md (branch `spec/portfolio-v2`)
branch: design/portfolio-v2
base: main @ 1e24b34
date: 2026-10-27
status: rendered, in review — awaiting Mauro's variant + availability pick
---

# sooth.dev v2 — design system and art direction

This is the stage-2 design contract. It names the tokens, the type system, the motion budget,
the components and the composition of every page, and it backs each one with a rendered check
from a real browser.

The direction from SOOT-25 §3 is binding and is not re-litigated here: **evidence-first engineer
portfolio**, gruvbox kept and rationed, the carnival deleted. Where the spec allowed a value to
move, this document states the value and why. Where the direction and the generic "quiet page"
instinct disagreed, the direction wins — a portfolio for a platform engineer is allowed mono
metadata and numbered work; it is not allowed decoration doing hierarchy's job.

**Scope of this branch.** `docs/design-portfolio-v2.md`, `docs/design/**`, `public/og/*.png`.
Nothing in `src/`, `public/cv.*` or `src/content/**` is touched. The prototypes under
`docs/design/` are standalone HTML + one CSS file; they are not imported by `src/` and are not
part of the Astro build. Their body copy is a **layout carrier** drawn from the research anchors —
the Implementers replace it with the audited copy from SOOT-25 §5 and `docs/content-audit.md`.
Any code or command transcript in a prototype is a shape demonstration to be replaced with the
real sanitised artefact.

---

## 1. Decisions in one screen

| # | Decision | Value | Why |
|---|---|---|---|
| 1 | Ground | `#282828`, one tone step per surface | Gruvbox dark, no gradient, no glass |
| 2 | Ink | `#ebdbb2` body, `#fbf1c7` headings | Both clear 4.5:1 on every surface used |
| 3 | Metadata | `#bdae93`, never `#928374` | The old grey fails at 4.02:1 / 3.16:1 |
| 4 | Accent | `#fabd2f`, once per viewport | Focus ring, primary action, current nav item |
| 5 | Reading face | system UI sans | 0 KB, no web-font risk |
| 6 | Label face | `ui-monospace` for dates, chips, numbers, code | D4; the cheapest way to look deliberate |
| 7 | Measure | `68ch` prose, `64rem` index/home | D3; the column now differs by page type |
| 8 | Home h1 | `clamp(2.5rem, 6vw, 3.5rem)` | One large thing, two lines max at 360 |
| 9 | Motion | 2 events, both `opacity`, ≤150 ms | D1, spec §3.5; nothing moves unless asked |
| 10 | Work on `/` | 3 curated, 5 on `/projects` | Q3 default |
| 11 | Home variants | A "The Index", B "The Notebook" | Materially different compositions, not a colour swap |
| 12 | Recommendation | **A** | Stronger hierarchy at 360 and a clearer proof-first read (see §8) |

---

## 2. Tokens

Names are the spec §3.4 contract. Values below are the ones the prototypes and every screenshot
in this delivery use; Implementers copy them into `src/styles/global.css` `@theme` unchanged.

```css
@theme {
  /* surfaces */
  --color-bg:        #282828;
  --color-surface:   #32302f;
  --color-surface-2: #3c3836;
  --color-border:    #504945;

  /* text */
  --color-text:        #ebdbb2;
  --color-text-strong: #fbf1c7;
  --color-muted:       #bdae93;
  --color-accent:      #fabd2f;
  --color-link:        #83a598;
  --color-code:        #e0a3b8;
  --color-focus:       #fabd2f;

  /* type */
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
    "Liberation Mono", monospace;
  --text-meta:    0.875rem;   /* 14 px */
  --text-body:    1.125rem;   /* 18 px */
  --text-lead:    1.25rem;    /* 20 px */
  --text-h3:      1.5rem;     /* 24 px */
  --text-h2:      2rem;       /* 32 px */
  --text-h1:      2.75rem;    /* 44 px */
  --text-display: clamp(2.5rem, 6vw, 3.5rem); /* 40–56 px */

  /* measure, width, space, radius, motion */
  --measure:       68ch;
  --width-wide:    64rem;     /* max-w-5xl */
  --space-section: clamp(3.5rem, 9vw, 6rem);
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --motion-fast: 150ms;
  --motion-ease: cubic-bezier(0.2, 0, 0, 1);
}
```

`--font-sans`, `--font-mono` and the `--space-*` steps are additions to the spec's list: fonts
need a token because the mono face is a first-class part of the system (D4), and the space steps
stop one-off `p-7`-style values creeping back in. No other names change. `--color-code` is the only
literal that is not a gruvbox primitive (there is no gruvbox purple that clears 4.5:1 on a card).

### 2.1 Colour roles and the one rule that matters

| Token | Value | Used for | Never for |
|---|---|---|---|
| `--color-bg` | `#282828` | page ground | text |
| `--color-surface` | `#32302f` | proof band, contact band, cards, mobile menu panel | body text |
| `--color-surface-2` | `#3c3836` | chips, inline code, code blocks, mobile menu panel | large text areas |
| `--color-border` | `#504945` | 1px structural hairlines (header/footer, list separators, table rows) | text; it is 1.67:1 on bg and would fail |
| `--color-text` | `#ebdbb2` | body copy, labels, table cells | — |
| `--color-text-strong` | `#fbf1c7` | h1–h3, card titles, link hover | — |
| `--color-muted` | `#bdae93` | dates, reading time, chips, sources, captions, footer legal | body copy |
| `--color-accent` | `#fabd2f` | focus ring, primary CTA fill, `aria-current` nav item, hover on links | decorative fills, headings (exception: none in this design) |
| `--color-link` | `#83a598` | links on `--color-bg` and `--color-surface` | links on `--color-surface-2` (4.31:1 — fails) |
| `--color-code` | `#e0a3b8` | inline code on `--color-surface-2` | body text |

Rules the implementation must keep:

1. **`#928374` is banned for text.** It fails 4.5:1 on every surface in the system.
2. **Blue links are only placed on bg or surface.** On surface-2 the link is `--color-accent`
   (6.84:1) or `--color-text-strong`.
3. **One accent per viewport.** On the home page the accent appears as the focus ring and the
   single filled CTA in the contact band; the current nav item gets it in the header. A second
   viewport (scrolled to the contact band) shows the same colour once.
4. **Borders never carry meaning alone.** A separator can be `--color-border`; anything a user
   must perceive (focus, selected state) uses accent.

### 2.2 Measured contrast

Method: WCAG 2.x relative luminance, computed with the script in §15.2. Every pair below is a
pair this design actually renders. Body text needs 4.5:1; large text and UI boundaries need 3:1.

| Foreground | Background | Ratio | Use | Verdict |
|---|---|---|---|---|
| `#ebdbb2` text | `#282828` bg | **10.75:1** | body copy, prose | pass |
| `#ebdbb2` text | `#32302f` surface | **9.57:1** | availability chip, contact copy, card body | pass |
| `#ebdbb2` text | `#3c3836` surface-2 | **8.45:1** | code-block text | pass |
| `#fbf1c7` text-strong | `#282828` bg | **12.99:1** | h1/h2/h3 on the page | pass |
| `#fbf1c7` text-strong | `#32302f` surface | **11.57:1** | card titles, contact heading | pass |
| `#fbf1c7` text-strong | `#3c3836` surface-2 | **10.22:1** | menu panel links on hover | pass |
| `#bdae93` muted | `#282828` bg | **6.77:1** | dates, reading time, sources | pass |
| `#bdae93` muted | `#32302f` surface | **6.03:1** | footer/rail metadata, muted copy in a band | pass |
| `#bdae93` muted | `#3c3836` surface-2 | **5.32:1** | chips, table headers, code metadata | pass |
| `#fabd2f` accent | `#282828` bg | **8.69:1** | nav current, links (alt), focus ring | pass |
| `#fabd2f` accent | `#32302f` surface | **7.74:1** | CTA on the contact band, focus on cards | pass |
| `#fabd2f` accent | `#3c3836` surface-2 | **6.84:1** | hover in the mobile menu panel | pass |
| `#83a598` link | `#282828` bg | **5.48:1** | prose links, footer links | pass |
| `#83a598` link | `#32302f` surface | **4.88:1** | links inside a surface band | pass |
| `#e0a3b8` code | `#3c3836` surface-2 | **5.58:1** | inline code | pass |
| `#282828` bg | `#fabd2f` accent | **8.69:1** | text on the filled CTA | pass |
| `#504945` border | `#282828` bg | **1.67:1** | structural hairline only — not text, not a state | n/a |

Failing pairs that this design therefore does **not** use:

| Pair | Ratio | Why it is gone |
|---|---|---|
| `#928374` on `#282828` | 4.02:1 | the current metadata grey; replaced by `#bdae93` |
| `#928374` on `#3c3836` | 3.16:1 | current description/date on a card |
| `#d3869b` on `#3c3836` | 4.23:1 | current inline code; replaced by `#e0a3b8` |
| `#83a598` on `#3c3836` | 4.31:1 | link blue on a card; accent or text-strong instead |
| `#a89984` on `#3c3836` | 4.17:1 | not used at all; would have been the "slightly lighter grey" trap |

All text in the system is ≥14 px, so the 4.5:1 body threshold applies everywhere; nothing relies
on the large-text 3:1 exemption except the display h1, which is 8.69:1 or better anyway.

---

## 3. Type system

Two faces, both already on the device.

| Token | Size | Face | Weight | Leading | Tracking | Used for |
|---|---|---|---|---|---|---|
| `--text-display` | 40–56 px | sans | 680 | 1.0 | −0.035em | home h1 only (variant A) |
| `--text-h1` | 44 px | sans | 680 | 1.05 | −0.032em | page h1, post/project h1 |
| `--text-h2` | 32 px | sans | 650 | 1.15–1.2 | −0.025em | section headings, prose h2 |
| `--text-h3` | 24 px | sans | 650 | 1.25 | −0.015em | card titles, prose h3, footer wordmark |
| `--text-lead` | 20 px | sans | 400 | 1.5 | 0 | hero lede, page lede |
| `--text-body` | 18 px | sans | 400 | 1.7 prose / 1.6 UI | 0 | body copy, most links |
| `1rem` | 16 px | sans / mono | 400 | 1.5 | 0 | post descriptions, nav, rail values |
| `--text-meta` | 14 px | mono | 400–500 | 1.4–1.7 | 0 | dates, reading time, chips, sources, labels, footer legal |

Rules:

- **One `h1` per page.** Home h1 is the name; every other page h1 is the page's subject
  ("Writing", "Aztecscan", the post title).
- **No heading is styled by a page-level one-off.** Add `text-3xl`-equivalent styling only through
  the tokens above; `grep`ing a page for `font-bold text-…` must not find the old pattern.
- **Prose measure is 68ch** (`max-width: var(--measure)`), never a Tailwind width class. Index,
  home and `/projects` use `--width-wide` (64rem = 1024 px at 1280) so the bands can compose.
- **Mono is never body copy.** It appears for dates, reading time, chips, source lines, numbers,
  rail labels and code. It is not used as a decorative uppercase eyebrow.
- **No uppercase text-transform anywhere.** Mono labels are sentence case; the words look
  deliberate without shouting.
- **No styled accent word inside a heading.** Headings are one colour (`--color-text-strong`);
  emphasis comes from size and position.
- **Link affordance**: underline by default in prose, no underline in nav/cards (the whole row is
  the target), hover raises to accent or text-strong. No colour-driven "four different cards".

The 44–56 px h1 is deliberately not larger. At 360 px, `Mauro Eijsenring` sets on one line at 40 px;
at 1280 it sets at 56 px in a 44ch column. The old site's problem was not a small headline, it was
an empty page under it.

---

## 4. Space, frame and radius

| Role | Value | Notes |
|---|---|---|
| Page gutter | `clamp(1.25rem, 4vw, 2rem)` | 20 px at 360, 32 px at 1280 |
| Outer frame | `64rem` max + equal gutters | one frame for header, main, footer |
| Section gap | `clamp(3.5rem, 9vw, 6rem)` | 56 px at 360, 96 px at 1280 |
| Within a band | 8 / 12 / 16 / 24 / 32 px from the space scale | no arbitrary margins |
| Radius | `0.25rem` chips/small, `0.5rem` code blocks/menu panel | cards are square; no pill shapes |
| Borders | 1px `--color-border` only as a structural separator | no 1px outlined card boxes, no shadows, no gradients |

The frame is one pair of equal outer margins at every width. Asymmetry happens inside the grid
(hero text / portrait, prose / rail), never by pushing the content to one side of the screen.

---

## 5. Motion inventory

Two events site-wide. Both are `opacity`; both are ≤150 ms; both disappear under reduced motion.

| # | Event | Where | Duration | Property | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|---|
| 1 | View-transition cross-fade | `ClientRouter` navigation between routes | 150 ms | `opacity` on `::view-transition-old/new(root)` | `animation: none`; the new page appears instantly |
| 2 | Mobile menu fade-in | `<details>` disclosure panel opening under 640 px | 120 ms | `opacity` | `animation: none`; panel appears instantly |

Nothing else is a motion event:

- Link, nav and card hover/focus feedback is an **instant** colour change, not a transition.
- The skip link appears instantly on focus.
- No element animates on load, on scroll, or in a loop.
- No `transform` animation exists; `hover:scale` is gone.

Deliberately deleted, and what replaces each:

| Deleted | Was | Replaced by |
|---|---|---|
| `animate-pulse-glow` | infinite `text-shadow` + `scale(1.05)` on the h1 | static `--color-text-strong` h1 |
| `animate-float` × 5 | five absolutely-positioned drifting dots | nothing — the proof band carries the visual interest |
| per-letter `animate-slide-up` | wordmark split into letters, 0.5→1.2 s delays | one h1, one line, no stagger |
| `animate-bounce` + `animate-pulse` divider | bouncing dot between pulsing bars | section spacing |
| `hover:scale-105` × 4 | link cards growing on hover | instant background/colour step |
| `--animate-fade-in` / `--animate-slide-up` | 2 s / 1.5 s entrance keyframes | nothing (content is visible without script) |
| `scroll-behavior: smooth` | global smooth scroll | default jump scroll |

Reduced-motion behaviour is global as well as per-event: animations and transitions collapse to
0.01 ms, view-transition pseudos are `none`, and scroll is auto. The measured result in the
prototype is `document.getAnimations().length = 0` after load and `transition-duration: 1e-05s`
under emulated `reduce` (§15.3).

---

## 6. Component inventory

Five components plus the frame. Everything else is a page composition, not a new component.

### 6.1 Site header / navigation

- Wordmark `sooth.dev` (text, 18 px, 650) linking `/`.
- Desktop (≥640 px): five plain links — Home, Projects, Blog, About, CV. 44×44 minimum target;
  current page gets `aria-current="page"` and an accent underline. No logo image, no bar chrome,
  no sticky blur.
- Mobile (<640 px): `<details>` disclosure. `<summary>` is the word "Menu" (74×44), panel is
  `--color-surface-2`, links are 48 px tall, panel closes on navigation. No JS.
- Header is sticky with `--color-bg` and one 1 px bottom border.
- Skip link is the first focusable element and jumps to `#main`.

### 6.2 ProjectCard

Used on `/`, `/projects`, and as the rail in variant B. Anatomy:

1. Number or meta row (mono, 14 px, muted): `01` on home A; `2024–2026 · Infrastructure · Completed`
   on B and on `/projects`.
2. Title (24 px, 650, `--color-text-strong`) — the only link in the card.
3. One-line outcome (18 px body, max 58ch) — a result, not a stack dump.
4. Up to four chips (mono 14 px, muted on `--color-surface-2`, `--radius-sm`).
5. Status word (`Completed`, `Private`, `Active`) inside the meta row, never as a coloured badge.

One card style only. Hierarchy comes from the number, the title size and the position — not from
four accent hues. On `/projects` the same anatomy sits in a two-column grid at ≥768 px; on home A
it is a full-width row.

### 6.3 PostCard

1. Date and reading time (mono 14 px, muted) — two lines in a 10.5rem column at ≥768 px, inline at
   360.
2. Title (18–20 px, 600, text-strong).
3. One-sentence description (16 px body, max 66ch).
4. Tags as chips (mono 14 px).
5. Optional project link in the meta line.

### 6.4 Metadata row, chips and availability line

- **Meta row**: flex-wrap, 14 px mono muted, no separators. Used under page h1s.
- **Chips**: 14 px mono, muted on `--color-surface-2`, 1 px border `--color-border`, 4 px radius,
  2 px/8 px padding. Max four on a project card.
- **Availability line**: in variant A's hero it is a `--color-surface` block, 14 px mono,
  8/12 padding, 4 px radius. In variant B's hero it is a mono paragraph with a 2 px accent left
  border. On `/about` it is a normal prose paragraph plus a rail value.
  The exact strings are in §9.

### 6.5 Footer

Designed close, not a sitemap: `sooth.dev` at 24 px, one row of mono links (Email, GitHub,
LinkedIn, About, RSS) at 44 px targets, copyright in 14 px muted. Background `--color-surface`,
no top border needed (tone step), no columns of links.

### 6.6 Rail (composition, not a standalone component)

On post, project and variant-B pages, a 15rem right rail holds metadata and an "On this page"
list. It is sticky at ≥992 px, hidden at 360–991 px where the same facts are in the header meta
row. It is marginalia; it is never the only place a fact appears.

---

## 7. Page compositions (D5 — every band answers the next question)

### 7.1 `/` — home, variant A "The Index" (recommended)

| # | Band | Answers | Content | Layout |
|---|---|---|---|---|
| 1 | Hero | Who is this and what do they do? | h1 `Mauro Eijsenring`; one role sentence; availability line; portrait 132×166 | Asymmetric: text left, portrait bottom-right; at 360 portrait 72×91 above the name |
| 2 | Proof | Is any of this verifiable? | Three facts: **678** commits on Aztecscan (of 1,812), **40** PRs on a client Kubernetes platform, **70** deploys in the July peak (from 6 in January) | Full-bleed `--color-surface` band, three display numerals in a 3-col grid at ≥768, stacked at 360 |
| 3 | Selected work | What has he shipped? | Aztecscan, The Grid, Bot Busters — each with one-line outcome, role/period/status, ≤4 chips | Numbered rows (`01`–`03`), 3-col grid at ≥896, stacked at 360 |
| 4 | Latest writing | Can he explain the work? | Three newest posts: date, reading time, title, one sentence | Rows with a 10.5rem mono date column at ≥768, inline at 360 |
| 5 | Contact | How do I hire or reach him? | Email as the one filled accent CTA; GitHub, LinkedIn, CV | `--color-surface` band, 2-col at ≥768, stacked at 360 |

### 7.2 `/` — home, variant B "The Notebook"

Same five questions, different composition:

| # | Band | Variant B composition |
|---|---|---|
| 1 | Hero | Narrow 68ch column, h1 44 px, two-sentence lede, availability with a 2 px accent rule. No portrait. |
| 2 | At a glance (rail) | Sticky right rail: Currently, Based, Elsewhere, Email. On mobile it becomes a compact 2×2 card directly under the hero. |
| 3 | Proof | A compact ledger inside the measure: number in a 5.5rem right-aligned mono column, fact + source beside it. It reads as evidence in a notebook, not a display band. |
| 4 | Selected work | Vertical entries inside the measure; meta line (period · role · status) above the title; no index numbers. |
| 5 | Latest writing | The same entries, date/reading inline above the title. |
| 6 | Contact | Inline at the end of the measure — no band, no button; the email address is a 20 px mono link. |

### 7.3 `/about`

| # | Section | Answers |
|---|---|---|
| 1 | `About` + lede | Who is this as an engineer (one sentence). |
| 2 | What I do | Platform + full-stack, freelancing since 2024, the through-line |
| 3 | The arc | Aztecscan (scale, protocol churn) → The Grid (serverless → Kubernetes) → Bot Busters/Boloney (realtime state machines), each linked |
| 4 | How I work | Decision records, parallel-run migrations, AI-agent guardrails — three paragraphs, each tied to a real artefact |
| 5 | Availability | The chosen one-line statement + what it means in practice |
| 6 | CV and contact | `/cv.pdf`, `/cv.md`, email, GitHub, LinkedIn. No address, phone, birthday or nationality |

Prototype body is 424 words, inside the 400–600 target. The rail repeats role/focus/availability
on desktop only.

### 7.4 `/blog`

`h1 Writing` + lede + RSS link; then one chronological list, newest first: date · reading time in
a 10.5rem column, title, one-sentence description, tags. Seven entries after stage 3c. No cards,
no pagination, no filters.

### 7.5 `/blog/[slug]`

| # | Band | Answers |
|---|---|---|
| 1 | Header | h1, description as lede, mono row: date · reading time · project link · tags |
| 2 | Thesis | What changed / what I claim — first two paragraphs |
| 3 | Mechanism | How it works, with the artefact (code, command, table) |
| 4 | Evidence | The commit, PR, command or output that proves it |
| 5 | Tradeoff / what this cost | The price accepted, in one honest section |
| 6 | What to steal / differently | The transferable lesson |
| 7 | Related | Project page first, then 2 posts sharing a tag |
| — | Rail | Published, reading time, project, tags, "On this page" (desktop only) |

### 7.6 `/projects`

`h1 Projects` + lede ("prototypes → platforms"); all five ProjectCards, featured first then
`order`; a contact line at the end. At ≥768 the featured card spans both columns (32 px title) and
the other four sit in a two-column grid (24 px titles); at 360 all five stack. One column at 360,
one card style, hierarchy from the featured span and title size — not from hue. Five is
deliberate: curation happens on `/`.

### 7.7 `/projects/[slug]`

Wide header (`--width-wide`): back link, h1, one-line summary, meta row (role · period ·
contribution · status · repo), stack chips. Then the reading grid: prose 68ch + sticky rail.

| # | Section | Content |
|---|---|---|
| 1 | The problem | What was broken, for whom — 2–3 sentences |
| 2 | My role and what I owned | Evidence: commits, PRs, files; names what a teammate built |
| 3 | The hard part | One decision, rejected alternatives, accepted tradeoff, cost |
| 4 | Outcome | Verifiable facts only |
| 5 | What I'd do differently | One honest paragraph |
| 6 | Artefact | One `pre`, table or figure next to §3/§4 |
| 7 | Related | Posts by `project:` |

Rail: role, period, contribution, stack, status, links, "On this page". At 360 the rail is hidden
and the header meta row carries the same facts; long inline code wraps (`overflow-wrap: anywhere`)
and `pre` scrolls inside its own box, so the page never scrolls horizontally.

### 7.8 `/404`

`h1 That page doesn't exist`, one line explaining the link may be old, four recovery links (Home,
Projects, Blog, About). `noindex`, no OG image, no JS. Served 404 by nginx (spec AC-12).

---

## 8. The two home variants — what actually differs

| Dimension | A — The Index | B — The Notebook |
|---|---|---|
| Container | 64rem, full-width bands | 68ch measure + 15rem sticky rail |
| H1 | 56 px display, portrait beside it | 44 px, no portrait |
| Proof | Full-bleed surface band, three 44 px numerals | Compact ledger inside the measure, 24 px numerals |
| Selected work | Numbered rows, right-aligned meta column | Vertical entries, meta line above title |
| Latest writing | Date column 10.5rem + content | Inline date/reading above title |
| Contact | Surface band + one filled accent button | Inline at the end, no button |
| Mobile character | Scannable, evidence-forward; proof is the second thing you see | Reading-first; the at-a-glance card comes before the proof |
| Feels like | A curated engineering index | A working notebook |

They are not a colour swap: the frame, the proof treatment, the work-item anatomy, the contact
treatment and the mobile order all differ. Both use the same tokens and the same five components,
so the chosen variant is one page rewrite, not a second design system.

**Recommendation: A.** Reasons, in order:

1. At 360 the proof band arrives immediately after the hero — three numbers a hiring manager can
   read in a glance. B inserts a four-row "at a glance" card first, which pushes the evidence down
   by roughly 200 px on the smallest screen. The work order makes mobile the primary target.
2. A's numbered rows make the "curated three" obvious and give the page a spine; B's entries are
   quieter but harder to scan at a glance.
3. A has a real contact band with one obvious action; B's inline contact is elegant but easy to
   miss at the end of a long scroll on a phone.
4. A's portrait gives the page a person before the first scroll without animation doing the work.

B remains a legitimate choice if Mauro wants the site to read like a document rather than an
index. It is the quieter of the two and the better read on a laptop; it is weaker on the 360 px
first screen.

---

## 9. Availability statements — two candidates for Mauro

Both are availability, not a CV objective. Both are already rendered: candidate 1 in variant A's
hero and on `/about`; candidate 2 in variant B's hero.

**Candidate 1 (spec Q4 default)**
> Open to freelance platform and infrastructure work.

Rendered in:
- variant A hero (`docs/design/screens/home-a-360.png`, `home-a-1280.png`), in the surface chip
  under the lede.
- `/about` Availability section and rail (`docs/design/screens/about-360.png`, `about-1280.png`).

**Candidate 2**
> Available for platform, infrastructure and migration work — contract or freelance.

Rendered in:
- variant B hero (`docs/design/screens/home-b-360.png`, `home-b-1280.png`), as the mono line with
  the 2 px accent rule.
- `/about` form, rendered as `about-b.html` (`docs/design/screens/about-b-360.png`,
  `about-b-1280.png`): the sentence followed by "That usually means Kubernetes and CI/CD, a service
  split or migration, or making a deployment story a small team can actually operate."

So both candidates exist as rendered `/about` pages, not as a promise: `about.html` carries
candidate 1, `about-b.html` carries candidate 2. Whichever Mauro picks, the Implementer changes one
string in the section and one in the rail.

Candidate 1 is shorter and broader; it fits the hero chip without wrapping to three lines.
Candidate 2 names the work (migrations) and the commercial shape (contract or freelance) and is
more useful to a buyer, at the cost of a longer line. Recommendation: **1 for the hero, 2's
second half as the `/about` explanation** — but the Foreman should put both in front of Mauro in
one question alongside the variant pick.

---

## 10. OG images

Six static 1200×630 PNGs in `public/og/`, one per page type as spec §3.6 requires. Produced from
rendered HTML at exactly 1200×630 in the sandbox Chromium, then palette-quantised to keep each
file far under the 35 KB budget.

| File | Page type | Title on card | Bytes | Dimensions |
|---|---|---|---|---|
| `public/og/home.png` | `/` | Mauro Eijsenring | 18,195 | 1200×630 |
| `public/og/about.png` | `/about` | Taking prototypes to production platforms | 25,426 | 1200×630 |
| `public/og/blog.png` | `/blog` | Field notes from operating platforms | 23,645 | 1200×630 |
| `public/og/post.png` | `/blog/[slug]` | The command, the commit, the tradeoff | 20,359 | 1200×630 |
| `public/og/projects.png` | `/projects` | Prototypes turned into platforms | 23,035 | 1200×630 |
| `public/og/project.png` | `/projects/[slug]` | The problem, the role, the hard part | 20,626 | 1200×630 |

Card anatomy: `sooth.dev` in accent top-left, author top-right, a 64×3 accent rule, the title at
84 px in `#fbf1c7`, one supporting line at 30 px in `#bdae93`, URL bottom-left. Same ground
`#282828` and same type as the site, so a shared link looks like the page it opens.

`og:image:alt` should be the card title, e.g. `Mauro Eijsenring — platform and infrastructure
engineer`. `Meta.astro` emits `og:image:width` 1200 and `og:image:height` 630 per spec §3.7.

Reproduce the PNGs with:

```bash
ssh -p 2222 -i ~/.ssh/vps_ed25519 agent@127.0.0.1 \
  'cd /path/to/sooth.dev-landing && node docs/design/render.mjs'
```

then quantise (one-off, sharp is not a project dependency):

```bash
node -e 'const sharp=require("/tmp/ogtool/node_modules/sharp"),fs=require("fs");
for(const f of fs.readdirSync("public/og")){const p="public/og/"+f;
sharp(p).png({palette:true,colours:64,dither:0.9,compressionLevel:9,effort:10}).toBuffer()
.then(b=>fs.writeFileSync(p,b))}'
```

The raw Chromium output is 43–60 KB; the quantised files above are the committed ones. If a
future card is added, it must stay at 1200×630 and under 35 KB or `AC-10` fails.

---

## 11. Mobile first — the 360 px composition is the primary one

The old site was designed at `max-w-3xl` and checked on a desktop. This one is composed at 360
first, then 768, then 1280.

**360 rules**

- One column, 20 px gutters, no horizontal scroll. `scrollWidth === innerWidth` on every prototype
  page (measured, §15.3).
- Nav collapses to `<details>`; the wordmark (75×44) and `Menu` (74×44) are the only header
  targets; every panel link is 192×48.
- Home order: portrait → h1 → role → availability → proof → work → writing → contact.
- Section gap 56 px; within-band gaps 8–24 px. The page is dense but not cramped.
- Type does not shrink below 14 px (mono meta) or 18 px (body). The h1 is never below 40 px.
- Every target is ≥44×44. The smallest visible target in the prototype is the wordmark at 75×44.
- Long identifiers wrap (`overflow-wrap: anywhere`); `pre` scrolls inside its own box; tables use
  short cells and a 14 px face so three columns fit at 360 without clipping the page. The project
  page's inline `HTTPRoute.spec.rules[].backendRefs[].name` was the only real overflow at 360 and
  is fixed by that rule.
- No hover-only information; no motion to reveal content.

**768 rules**

- Desktop nav replaces the disclosure at 640 px.
- Proof becomes three columns; work rows get the right meta column; post rows get the 10.5rem
  date column.
- The post/project rail stays hidden until 992 px, where there is room for a 15rem marginalia
  column without squeezing the 68ch measure.

**1280 rules**

- Frame 64rem, 32 px gutters, 96 px section gap.
- Home A: hero portrait 132×166 at the bottom-right of the text block; proof numerals at 44 px.
- Reading pages: 68ch prose left, 15rem sticky rail right. The empty column under a short rail is
  intentional marginalia, not a missing band; the rail carries "On this page" so it stays useful.

**Measured, not asserted** (all eight page compositions × 360/768/1280):

| Page | 360 | 768 | 1280 | H1 | Smallest nav target |
|---|---|---|---|---|---|
| home A | 360/360 | 768/768 | 1280/1280 | 1 | 75×44 |
| home B | 360/360 | 768/768 | 1280/1280 | 1 | 75×44 |
| project | 360/360 | 768/768 | 1280/1280 | 1 | 75×44 |
| post | 360/360 | 768/768 | 1280/1280 | 1 | 75×44 |
| blog | 360/360 | 768/768 | 1280/1280 | 1 | 75×44 |
| projects | 360/360 | 768/768 | 1280/1280 | 1 | 75×44 |
| about (candidate 1) | 360/360 | 768/768 | 1280/1280 | 1 | 75×44 |
| about (candidate 2) | 360/360 | 768/768 | 1280/1280 | 1 | 75×44 |

---

## 12. Deletion arguments (D7 — what replaces what)

| Deleted | Why | What replaces it |
|---|---|---|
| `src/pages/index.astro:9–115` hand-rolled `<!doctype>`, `<head>`, `<body>`, nav, footer | Two shells drift; the home page's head has no `site`, no canonical, no OG; the layout already exists | `BaseLayout` + `Meta`. One shell, one place for skip link, `<main id="main">`, nav and footer. The home page becomes five bands on top of it. |
| The light gruvbox palette (12 `--color-gruvbox-light-*` vars) | Nothing uses it; it doubles the colour surface and invites a half-built theme toggle | Delete. No light mode is in scope. If it ever returns, it comes back as semantic tokens with measured pairs, not primitives. |
| `--color-gruvbox-bright-*` (7 duplicate vars) | Byte-identical to the non-bright colours; only the deleted landing page used them | Delete. `--color-gruvbox-*` + semantic tokens are the only names. |
| `--animate-fade-in`, `--animate-slide-up`, `--animate-pulse-glow`, `--animate-float` and their keyframes | D1: they are the carnival; none is usable at ≤150 ms | The two-event budget in §5. |
| 18 hex literals in `prose.css` | The palette was not the source of truth, so contrast fixes could not be made once | `var(--color-text)`, `var(--color-text-strong)`, `var(--color-muted)`, `var(--color-link)`, `var(--color-code)`, `var(--color-surface-2)`, `var(--color-border)`. Inline code moves from failing `#d3869b` to `#e0a3b8` (5.58:1). |
| Raw `background-color: #282828; color: #ebdbb2` outside `@theme` | Same reason; AC-5 forbids it | `background: var(--color-bg); color: var(--color-text)`. |
| Four full-width social link cards, each a different accent hue, `hover:scale-105` | The entire visual budget on the old home went to four links and no evidence; four hues is decoration pretending to be hierarchy | The contact band: one filled accent CTA + three mono text links. The proof band and work rows take the visual budget. |
| `max-w-3xl` on every page and every component | One column means nothing can compose; the home page cannot be a grid and prose cannot be narrowed relative to an index | `--width-wide` (64rem) for home/index/projects; `--measure` (68ch) for prose and reading columns; the rail explains the difference. |
| `text-3xl md:text-4xl font-bold text-gruvbox-yellow` repeated on four page types | One heading size everywhere is the visible definition of "template" | The type scale in §3: h1 44, h2 32, h3 24, body 18, meta 14, with one h1 per page. |
| `formatPeriod` in `src/lib/dates.ts` | Dead code (zero call sites) | Delete; `formatDate` stays. Listed here because the spec's file list assigns it in stage 3, not stage 2. |

Cost of the deletion: the old home page's "personality" was the animation. Removing it without
adding evidence would leave a thin page; that is why the proof band, the work rows and the contact
band exist. The proof band is the replacement for the glow.

---

## 13. What the Implementers must reproduce

1. **Copy the `@theme` block in §2 verbatim.** Values, not spirit. If a value must change, it
   changes here first with a re-measured contrast row.
2. **No hex outside `@theme`.** `prose.css` consumes `var(--color-*)` only. Inline code is
   `#e0a3b8`, not `#d3869b`.
3. **Use the type tokens.** No `text-3xl`/`font-bold` one-offs on pages. One h1 per page.
4. **Compose, do not card-ify.** Home A is bands; `/projects` is the same card in a grid. There is
   one card style.
5. **Delete before adding.** The shell, the unused palettes, the keyframes and the link cards go
   in the same change that adds the new bands; otherwise the new page inherits the old page's
   ghost.
6. **The prototypes are reference, not source.** `docs/design/*.html` must not be imported by
   `src/`. Rebuild the components as Astro components per spec §3.2; the CSS there is authored
   CSS in a Tailwind v4 `@theme` world, not a second stylesheet to copy wholesale.
7. **Keep the content separate.** The prototype's project/post copy is a carrier, not audited
   copy. Implementer B's content and `docs/content-audit.md` replace it; every number in the
   prototypes is already anchored (678/1,812 `00-index.md:58`; 40 PRs `00-index.md:66`; 70
   deploys `04-okutama.md:226`).
8. **Do not ship the prototype screenshots as site images.** They are evidence, not assets.

---

## 14. Rendered evidence

### 14.1 What was rendered

Real Chromium (Playwright-driven; binary `/opt/ms-playwright/chromium-1194/chrome-linux/chrome`,
`Chromium 141.0.7390.37`) from the build sandbox, against `file://` URLs of the prototypes.
Device scale factor 2 for the page screenshots; 1 for the 1200×630 OG cards. Full-page captures.

| File | Page | CSS viewport |
|---|---|---|
| `docs/design/screens/home-a-360.png` | variant A | 360 |
| `docs/design/screens/home-a-1280.png` | variant A | 1280 |
| `docs/design/screens/home-a-360-nojs.png` | variant A, JavaScript disabled | 360 |
| `docs/design/screens/home-b-360.png` | variant B | 360 |
| `docs/design/screens/home-b-1280.png` | variant B | 1280 |
| `docs/design/screens/project-360.png` | Aztecscan project page | 360 |
| `docs/design/screens/project-1280.png` | Aztecscan project page | 1280 |
| `docs/design/screens/post-360.png` | `parallel-run` post | 360 |
| `docs/design/screens/post-1280.png` | `parallel-run` post | 1280 |
| `docs/design/screens/blog-360.png` / `blog-1280.png` | `/blog` | 360 / 1280 |
| `docs/design/screens/projects-360.png` / `projects-1280.png` | `/projects` | 360 / 1280 |
| `docs/design/screens/about-360.png` / `about-1280.png` | `/about`, availability candidate 1 | 360 / 1280 |
| `docs/design/screens/about-b-360.png` / `about-b-1280.png` | `/about`, availability candidate 2 | 360 / 1280 |

Command (from the repo root, inside the sandbox):

```bash
ssh -p 2222 -i ~/.ssh/vps_ed25519 agent@127.0.0.1 \
  'cd /path/to/sooth.dev-landing && node docs/design/render.mjs'
```

`docs/design/render.mjs` opens each prototype at 360/768/1280, measures it, writes the full-page
PNGs and the six OG cards, then writes `docs/design/render-report.json`. The `--screenshot` CLI
form is not used because it captures only the viewport; the report is the machine-checkable part.

### 14.2 Measured layout (from `render-report.json`)

```
home-a 360  360/360  ok  h1=1  nav=sooth.dev 75x44  anims=0  js=0
home-a 768  768/768  ok  h1=1  nav=sooth.dev 75x44  anims=0  js=0
home-a 1280 1280/1280 ok h1=1  nav=sooth.dev 75x44  anims=0  js=0
home-b 360/768/1280  360/360, 768/768, 1280/1280 ok h1=1 anims=0 js=0
project 360/768/1280 360/360, 768/768, 1280/1280 ok h1=1 anims=0 js=0
post 360/768/1280    360/360, 768/768, 1280/1280 ok h1=1 anims=0 js=0
blog 360/768/1280    360/360, 768/768, 1280/1280 ok h1=1 anims=0 js=0
projects 360/768/1280 360/360, 768/768, 1280/1280 ok h1=1 anims=0 js=0
about 360/768/1280   360/360, 768/768, 1280/1280 ok h1=1 anims=0 js=0
about-b 360/768/1280 360/360, 768/768, 1280/1280 ok h1=1 anims=0 js=0
```

Desktop nav targets measured at 1280: `Home 65×44`, `Projects 80×44`, `Blog 54×44`,
`About 64×44`, `CV 44×44`, wordmark `75×44`. At 360: wordmark `75×44`, `Menu 74×44`, panel links
`192×48`. No target is under 44 in either dimension.

### 14.3 No-JS and reduced-motion checks

JavaScript disabled, variant A at 360 (`home-a-360-nojs.png`):

```
h1 count: 1        first lines: "Mauro Eijsenring", the role sentence, the availability line, "678"
main innerText length: 2,013 characters
authored <script> elements: 0
```

Reduced motion emulated at 1280:

```
document.getAnimations().length: 0
computed transition-duration on a link: 1e-05s (0.01ms)
```

Normal load, all six pages: `document.getAnimations().length = 0` and `jsBytes = 0` (the
prototype ships no scripts; the real site's only script is Astro's `<ClientRouter />`, per AC-3).

### 14.4 Contrast command

```bash
node -e '
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255)
  .map(c=>c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4));
const L=h=>{const [r,g,b]=hex(h);return 0.2126*r+0.7152*g+0.0722*b};
const R=(a,b)=>{const x=L(a),y=L(b);
  return ((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(2)};
console.log(R("#bdae93","#3c3836"), R("#e0a3b8","#3c3836"), R("#fabd2f","#282828"));
'
# 5.32 5.58 8.69
```

### 14.5 OG verification

```
home      1200x630 18195B
about     1200x630 25426B
blog      1200x630 23645B
post      1200x630 20359B
projects  1200x630 23035B
project   1200x630 20626B
```

All six are PNG, 1200×630, and below the 35 KB ceiling in spec §3.6 / AC-10.

---

## 15. What this delivery did not do

- **It did not build the Astro site.** No `src/` change, no `bun run build`, no Astro compile. The
  prototypes are static HTML/CSS by design so the design can be judged before the shell moves.
  AC-1, AC-11, AC-18 and the rest are the Implementers' and Verifier's evidence, not this stage's.
- **It did not write the final content.** The prototype body copy is a layout carrier; project and
  post pages are shorter than the 600–900 / 1,000–1,500 word targets on purpose. Implementer B
  replaces it and attaches the factual audit.
- **It did not touch `src/`, `public/cv.*`, `src/content/**`, `nginx.conf` or `astro.config.mjs`.**
- **It did not render `/404`.** The 404 composition is specified in §7.8 and is deliberately the
  smallest page type; there is no evidence shot for it in this set. If the Foreman wants one
  before build, it is a five-minute addition to the prototype set.
- **It did not test a real `ClientRouter` view transition.** The prototype has no Astro router;
  event 1 is specified against the API the Implementer writes and must be re-measured in stage 3.
- **It did not run Lighthouse.** Static file prototypes have no build output or server headers;
  AC-18 belongs to the built site.
- **It did not commit anything from the read-only research directory on the factory host.** All
  numbers used here come from the anchors cited in SOOT-25 §5 / SOOT-26 §5; the research
  directory was read only.

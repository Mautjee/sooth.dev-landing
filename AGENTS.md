# SOOTH.dev — Landing Page + Blog + Portfolio

Personal site for Mauro Eijsenring. Live at **sooth.dev**.

## Stack (Astro 7.3.1)

- **Astro 7** static site generator
- **Tailwind CSS v4** — CSS-first config in `src/styles/global.css` (the gruvbox palette
  lives in `@theme`, NOT in a `tailwind.config.mjs`)
- **`@tailwindcss/vite`** plugin (in `astro.config.mjs`, not `@astrojs/tailwind`)
- **Bun** for CI build (`oven/bun` in `Dockerfile`); npm also works locally
- **Component router**: `<ClientRouter />` from `astro/components/ClientRouter.astro`
  (the old `<ViewTransitions />` from `astro:transitions` was renamed in Astro 7)

## Project layout

```
src/
  content.config.ts      # Content Layer API — collections defined here
  content/
    blog/                # blog posts (.md). Drop a file here → appears on /blog
    projects/            # portfolio projects (.md). Drop a file here → appears on /projects
  components/
    Nav.astro            # top nav (Home / Blog / Projects)
    Footer.astro         # links footer
  layouts/
    BaseLayout.astro     # html shell: head, nav, footer, ClientRouter
    BlogPost.astro       # blog post wrapper (header + tags + prose)
  styles/
    global.css           # Tailwind v4 import + gruvbox @theme + base styles
    prose.css            # markdown typography (shared by blog + project pages)
  pages/
    index.astro          # landing / link hub
    blog/index.astro     # blog list
    blog/[slug].astro    # single post
    projects/index.astro # project grid
    projects/[slug].astro# single project
```

## The flow: adding content

Both collections are **markdown files** — no build step, no code. This is the pattern to
copy to other projects.

### Add a blog post
1. Create `src/content/blog/<slug>.md`
2. Frontmatter (required): `title`, `description`, `pubDate`; optional `tags[]`, `project`
   (slug of a project entry), `updatedDate`, `draft`
3. Write markdown below the frontmatter. Code blocks are highlighted with Shiki.
4. Done. Link is `/blog/<slug>`.

### Add a project
1. Create `src/content/projects/<slug>.md`
2. Frontmatter: `title`, `role`, `period`, `summary` (required); `repo`/`live` (URLs),
   `stack[]`, `status` (`active|completed|archived|private`), `featured`, `order`,
   `tags[]`
3. Write the write-up below the frontmatter. Link is `/projects/<slug>`.
4. `featured: true` floats it to the top of the grid.

### Remove a post/project
Delete the file. It disappears on the next build.

## Content conventions (from ~/Dev/Portfolio/research)

- **Attribution honesty matters.** Only claim work verifiable in git. Research flags hooks
  that are NOT Mauro's (e.g. Boloney's ZK proofs, Bot Busters' bot AI) — keep those out of
  the claim.
- Private/client work (e.g. The Grid) is written generically, marked `status: private`.
- Cross-linking: a blog post can reference a project via `project: <slug>`.

## Build & deploy

```bash
npm install        # or: bun install (CI uses bun --frozen-lockfile)
npm run build      # outputs static site via astro build → dist/
npm run preview -- --ignore-lock   # local preview (port 3000)
```

Deploy = push to `main`. Dokploy rebuilds the Docker image (Bun → astro build → nginx) and
ships the static site. No manual step.

## Pitfalls (Astro 4 → 7 migration)

1. **Content collections:** config must be at `src/content.config.ts` (NOT `src/content/config.ts`),
   and every collection needs a **loader** (`glob`), not a `type: 'content'` field. `z` comes
   from `astro/zod`.
2. **Entry id, not slug:** the new API exposes `entry.id` (file stem); old `entry.slug` is gone.
3. **ViewTransitions renamed to ClientRouter** — `import ClientRouter from 'astro/components/ClientRouter.astro'`.
4. **Tailwind v4 has no `tailwind.config.mjs`** — colors go in `@theme` in `global.css` (e.g.
   `--color-gruvbox-yellow: #fabd2f`). `@astrojs/tailwind` is deprecated.
5. **Shiki themes must be bundled** — `gruvbox-dark` is not included; use a bundled theme
   (`github-dark`) in `astro.config.mjs`.
6. **Node 22.12+ required** (Astro 6+). Local has v22.22.
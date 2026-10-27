# sooth.dev

Mauro Eijsenring's portfolio: platform and infrastructure work with the commits, pull requests and
tradeoffs that back each claim.

## Stack

- **Astro 7** — static output, content collections (`glob` loader), `entry.id` slugs.
- **Tailwind CSS v4** — CSS-first configuration. Tokens live in `src/styles/global.css` `@theme`;
  there is no `tailwind.config.mjs`.
- **Bun** — package manager and task runner.
- **Docker + nginx** — the production image; `nginx.conf` serves `404.html` with a 404 status.

## Development

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # static build into dist/
bun run preview    # serve dist/ locally
```

`bun run build` also runs `scripts/postbuild.mjs`, which enforces the one-`h1`-per-page invariant on
the built HTML.

## Content

- Posts: `src/content/blog/*.md` — `title`, `description`, `pubDate`, optional `updatedDate`,
  `tags`, `project` (slug of a project entry), `draft`.
- Projects: `src/content/projects/*.md` — `title`, `role`, optional `period`, `repo`, `live`,
  `stack`, `status` (`active | completed | archived | private`), `summary`, `featured`, `order`,
  `tags`.

Add a markdown file and it appears on `/blog` or `/projects`. Do not add an `# H1` to a body — the
layout renders the title.

## Verification

`scripts/verify.mjs` is dependency-free and used as acceptance evidence (spec §6):

```bash
node scripts/verify.mjs meta dist
node scripts/verify.mjs weight dist public
node scripts/verify.mjs motion http://localhost:4321/ http://localhost:4321/projects/aztecscan/
node scripts/verify.mjs layout http://localhost:4321/ --width 360
node scripts/verify.mjs shots http://localhost:4321 docs/evidence/screens
```

The browser subcommands use the Chromium/Playwright already installed in the build sandbox; nothing
is added to `package.json`.

## Deployment

Merging to `main` is the deploy trigger. Do not force-push `main`; open a pull request.

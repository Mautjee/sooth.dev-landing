# Agent Guidelines

## Commands
- Build: `bun run build`
- Dev server: `bun run dev` (runs on localhost:3000)
- Preview: `bun run preview`
- No test framework configured

## Code Style
- **Package manager**: Use `bun` (specified in package.json)
- **Imports**: ES modules (`import`/`export default`)
- **File extensions**: `.astro` for pages, `.mjs` for config files
- **Formatting**: Use single quotes for strings, no semicolons in JSX-style code
- **CSS**: Use Tailwind CSS classes, prefer utility-first approach
- **Colors**: Follow Gruvbox color scheme (defined in tailwind.config.mjs)
- **Animations**: Use predefined Tailwind animations (fade-in, slide-up, pulse-glow, float)
- **HTML**: Use semantic HTML5 elements, proper meta tags
- **Accessibility**: Include proper alt text, ARIA labels where needed

## Project Structure
- Pages in `src/pages/` (Astro components)
- Static assets in `public/`
- Tailwind config extends Gruvbox theme with custom animations
- Server runs on 0.0.0.0:3000 for container compatibility
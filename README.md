# Coming Soon Landing Page

A beautiful, animated "Coming Soon" landing page built with Astro.js, Tailwind CSS, and the Gruvbox color scheme.

## Features

- 🎨 Beautiful Gruvbox color palette
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- 🐳 Docker containerized
- ⚡ Built with Astro.js and Bun
- 💌 Email signup form
- 🎭 Interactive mouse effects

## Development

### Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

### Docker Development

```bash
# Run in development mode
docker-compose --profile dev up

# Or run production build
docker-compose up
```

## Building

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

## Docker Commands

```bash
# Build and run production container
docker build -t coming-soon .
docker run -p 3000:3000 coming-soon

# Using docker-compose
docker-compose up -d
```

## Customization

- Update the company name and branding in `src/pages/index.astro`
- Modify colors in `tailwind.config.mjs` 
- Add your own favicon in `public/favicon.svg`
- Customize animations and styling as needed

## Tech Stack

- **Astro.js** - Static site generator
- **Tailwind CSS** - Utility-first CSS framework
- **Bun** - Fast JavaScript runtime and package manager
- **Docker** - Containerization
- **Gruvbox** - Color scheme
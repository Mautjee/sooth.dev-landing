# Multi-stage build for static Astro site with Bun
FROM oven/bun:1 AS base
WORKDIR /app

# Copy package files for dependency installation
COPY package.json bun.lockb ./

FROM base AS build-deps
RUN bun install --frozen-lockfile

FROM build-deps AS build
COPY . .
RUN bun run build

# Production runtime using NGINX for static files
FROM nginx:alpine AS runtime

# Copy custom NGINX config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# NGINX will start automatically
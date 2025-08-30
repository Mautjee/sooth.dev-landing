# Use the official Bun image
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine as production

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Copy built application
COPY --from=base /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "3000"]
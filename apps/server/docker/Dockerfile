# Base image with Bun
FROM oven/bun:1.2.10 AS base
WORKDIR /app

# Install any needed system packages (e.g. OpenSSL for Prisma)
RUN apt-get update && apt-get install -y openssl

# Build stage
FROM base AS builder
WORKDIR /app

# Copy everything
COPY . .

# Install deps from bun.lock
RUN bun install --frozen-lockfile

# Build the project
RUN bunx turbo run build --filter=@cmumaps/server...

# Final runtime image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --gid 1001 server
USER server

# Copy only what's needed to run the server
COPY --from=builder --chown=server:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=server:nodejs /app/node_modules/.prisma /app/node_modules/.prisma

EXPOSE 3000
CMD ["bun", "apps/server/dist/index.js"]
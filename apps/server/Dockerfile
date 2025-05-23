# Base image with Bun
FROM oven/bun:1.2.10 AS base
WORKDIR /app
ENV HOME=/home
ENV PORT=3000

# Install any needed system packages (e.g., for Prisma or OpenSSL)
RUN apt-get update && apt-get install -y openssl

# Build stage
FROM base AS builder
WORKDIR /app

# Copy everything
COPY . .

# Install deps from bun.lock
RUN bun install --frozen-lockfile

# Generate Prisma client
RUN bunx prisma generate --schema=packages/db/prisma/schema.prisma

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
COPY --from=builder /app/apps/server/package.json .
COPY --from=builder --chown=server:nodejs /app/apps/server/dist ./apps/server/dist

# Copy Prisma client (adjust if it's in .prisma instead of node_modules)
COPY --from=builder --chown=server:nodejs /app/node_modules/.prisma /app/node_modules/.prisma

# copy over the entire packages directory
# COPY --from=builder --chown=server:nodejs /app/packages/ .

EXPOSE $PORT
CMD ["bun", "apps/server/dist/index.js"]
# Base image with Bun
FROM oven/bun:latest AS base
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

# Generate DB schema and OpenAPI spec
RUN cd apps/server && bun run db-generate && bun run tsoa && bun run openapi

# Build the project
RUN bun run build --filter=@cmumaps/server...

# Final runtime image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --gid 1001 server
USER server

# Copy swagger UI
COPY --from=builder --chown=server:nodejs /app/apps/server/build/swagger.yaml ./build/swagger.yaml
COPY --from=builder --chown=server:nodejs /app/node_modules/swagger-ui-dist /app/node_modules/swagger-ui-dist
RUN rm /app/node_modules/swagger-ui-dist/index.html

# Copy only what's needed to run the server
COPY --from=builder --chown=server:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=server:nodejs /app/node_modules/prisma /tmp/prisma-engines

EXPOSE 3000
CMD ["bun", "apps/server/dist/server.js"]
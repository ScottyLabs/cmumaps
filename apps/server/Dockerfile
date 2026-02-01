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
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid 1001 server
USER server

# Copy Swagger spec
COPY --from=builder --chown=server:nodejs \
  /app/apps/server/build/swagger.yaml \
  /app/apps/server/build/swagger.yaml

# Copy Swagger UI dist
# (which can be either in apps/node_modules or apps/server/node_modules)
# COPY --from=builder --chown=server:nodejs \
#   /app/apps/node_modules/swagger-ui-dist \
#   /app/apps/node_modules/swagger-ui-dist
COPY --from=builder --chown=server:nodejs \
  /app/apps/server/node_modules/swagger-ui-dist \
  /app/apps/server/node_modules/swagger-ui-dist

# Copy Prisma engines
# (which can be either in apps/node_modules or apps/server/node_modules)
# COPY --from=builder --chown=server:nodejs \
#   /app/apps/node_modules/prisma \
#   /tmp/prisma-engines
COPY --from=builder --chown=server:nodejs \
  /app/apps/server/node_modules/prisma \
  /tmp/prisma-engines

# Copy only what's needed to run the server
COPY --from=builder --chown=server:nodejs \
  /app/apps/server/dist \
  /app/apps/server/dist

EXPOSE 3000
CMD ["cd", "apps/server", "&&", "bun", "dist/server.js"]

FROM node:lts AS lts

RUN apt-get update -y \
    && apt-get install -y openssl

# Setup pnpm and turbo on the alpine base
FROM lts AS base

ENV HOME=/home
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@9.9.0 --activate

RUN pnpm install -g turbo

# Prune projects
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm exec turbo prune @cmumaps/server --docker

# Build the project
FROM base AS builder
WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

# Generate Prisma Client
RUN cd apps/server && pnpm prisma generate

RUN pnpm turbo build --filter=@cmumaps/server...
RUN pnpm prune --prod --no-optional

# Run the project
FROM lts AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 server

RUN chown -R server $HOME

USER server

COPY --from=builder app/apps/server/package.json .
COPY --from=builder --chown=server:nodejs app/apsps/server/dist ./apps/server/dist
COPY --from=builder --chown=server:nodejs app/apps/server/node_modules/prisma/libquery_engine-linux-musl-openssl-3.0.x.so.node /app/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node

COPY --chown=node:node --from=build /usr/src/app/apps/server/node_modules/prisma/client  /app/.prisma/client

EXPOSE $PORT
RUN cd apps/server
CMD ["node", "dist/index.cjs"]
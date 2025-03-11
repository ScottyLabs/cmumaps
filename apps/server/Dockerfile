FROM node:22-alpine AS alpine

RUN apk update \
    && apk add --no-cache openssl

# Setup pnpm and turbo on the alpine base
FROM alpine AS base

ENV HOME=/home
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@9.9.0 --activate

RUN npm install -g @prisma/engines@6.4,1
RUN cp /usr/local/lib/node_modules/@prisma/engines/libquery_engine-*.so.node /
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
FROM alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 server

RUN chown -R server $HOME

USER server

COPY --from=builder app/apps/server/package.json .
COPY --from=builder --chown=server:nodejs app/apps/server/dist ./apps/server/dist

EXPOSE $PORT
CMD ["node", "apps/server/dist/index.cjs"]
# AGENTS.md

## Cursor Cloud specific instructions

### Overview

CMU Maps is a Turborepo monorepo with 4 apps and 3 shared packages. See `README.md` and `.github/CONTRIBUTING.md` for general project info.

### Services

| Service | Port | How to start (from repo root unless noted) |
| --- | --- | --- |
| PostgreSQL 17 | 5432 | `sudo docker start cmumaps-postgres` (or create via `docker run`) |
| Server (`@cmumaps/server`) | 80 | `bun run dev:server` |
| Web app (`@cmumaps/web`) | 5173 | `bun run dev:web:host` |

### Key gotchas

- **`DATABASE_URL` in shell env**: The VM may have a stale `DATABASE_URL` env var (e.g. `postgres:5432` from Docker Compose). Always `unset DATABASE_URL` before starting the server, or rely on `dotenv -e .env` properly. The server's `.env` should point to `localhost:5432`.
- **`SERVER_PORT` in Zod v4**: `z.number()` in Zod v4 does NOT coerce strings. Do NOT set `SERVER_PORT` in `.env`; let it default to 80. Use `sudo setcap cap_net_bind_service=+ep $(which bun)` to allow binding port 80 without root.
- **Code generation before lint/build**: Before running `bun run check`, `bun run lint`, `bun run tsc`, or `bun run build`, run `bun run sync` from the repo root (wraps server `db-generate`, `tsoa`, and `openapi`).
- **Pre-commit hooks** (`.husky/pre-commit`): Runs `editorconfig-checker`, `syncpack lint`, `biome check`, and `uv run lint` for Python. These are automatically run by husky on commit.

### Populating the database from S3

The dataflow app reads JSON from S3 and POSTs to the server's `/populate-table/*` endpoints. Required env vars in `apps/dataflow/.env`: `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `SERVER_URL`, `AUTH_CLIENT_ID`, `AUTH_CLIENT_SECRET`. The server must be running with valid OIDC config (AUTH_ISSUER, AUTH_JWKS_URI derived from `tsoa.json`'s openIdConnectUrl). Run: `cd apps/dataflow && uv run populate-database`. After populating, restart the server to rebuild the in-memory search index and graph cache.

### Standard commands

- **Lint/check**: `bun run check` (runs turbo check across all packages — combines `tsc -b` + `biome check`)
- **Python lint**: `cd apps/dataflow && uv run lint`
- **Build**: `bun run build`
- **Dev (server + web)**: `bun run dev:web` (uses turbo to start both)
- **Dev (server + web, no auth)**: `bun run dev:web:noauth` (bypasses CMU login — sets `IGNORE_LOGIN=true` and `VITE_IGNORE_LOGIN=true`). Use for local development and features that need auth (e.g. floorplans, POI routing).
- **Dev (server only)**: `bun run dev:server`
- See `package.json` scripts for the full list.

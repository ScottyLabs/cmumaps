# AGENTS.md

## Cursor Cloud specific instructions

### Overview

CMU Maps is a Turborepo monorepo with 4 apps and 3 shared packages. See `README.md` and `.github/CONTRIBUTING.md` for general project info.

### Services

| Service | Port | How to start |
|---|---|---|
| PostgreSQL 17 | 5432 | `sudo docker start cmumaps-postgres` (or create via `docker run`) |
| Server (`@cmumaps/server`) | 80 | `cd apps/server && bunx dotenv -e .env -- bun run --watch src/server.ts` |
| Web app (`@cmumaps/web`) | 5173 | `cd apps/web && bunx vite --port 5173 --host` |

### Key gotchas

- **`DATABASE_URL` in shell env**: The VM may have a stale `DATABASE_URL` env var (e.g. `postgres:5432` from Docker Compose). Always `unset DATABASE_URL` before starting the server, or rely on `dotenv -e .env` properly. The server's `.env` should point to `localhost:5432`.
- **`SERVER_PORT` in Zod v4**: `z.number()` in Zod v4 does NOT coerce strings. Do NOT set `SERVER_PORT` in `.env`; let it default to 80. Use `sudo setcap cap_net_bind_service=+ep $(which bun)` to allow binding port 80 without root.
- **Code generation before lint/build**: Before running `bun run check`, `bun run lint`, `bun run tsc`, or `bun run build`, you must first generate the server's build artifacts: `cd apps/server && bun run db-generate && bun run tsoa && bun run openapi` (or use `bun run sync` from the root).
- **Pre-commit hooks** (`.husky/pre-commit`): Runs `editorconfig-checker`, `syncpack lint`, `biome check`, and `uv run lint` for Python. These are automatically run by husky on commit.

### Standard commands

- **Lint/check**: `bun run check` (runs turbo check across all packages — combines `tsc -b` + `biome check`)
- **Python lint**: `cd apps/dataflow && uv run lint`
- **Build**: `bun run build`
- **Dev (server + web)**: `bun run dev:web` (uses turbo to start both)
- **Dev (server only)**: `bun run dev:server`
- See `package.json` scripts for the full list.

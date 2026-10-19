# Development scripts and Kennel scaffold

Start with the [running guide](../../docs/src/Setup.md) for cross-platform quick
start, OpenBao login, data import, and the equivalent manual commands.

## Entry points

| File | Runs where | Purpose |
| --- | --- | --- |
| `dev.py` | Host Python, no extra packages | `start`, `secrets`, `upload`, `populate`, `shell`, `logs`, `stop` |
| `container.ts` | Host Bun (optional shortcut) | Selects Python for `bun run dev:container` on each OS |
| `container.sh` | Host Bash (compatibility) | Calls `dev.py start` |
| `container-app.sh` | Linux devcontainer | Installs runtimes/dependencies, generates code, syncs schema, starts app |
| `populate.sh` | Host Bash or container | Reads hosted CDN data (or explicit Garage source) into the local backend |
| `upload.sh` | Linux devcontainer | Uploads only the known dataset JSON filenames to local Garage |
| `prepare.ts` | Native host workflow | Older Bun setup, separate from the container launcher |

The portable launcher uses the selected Docker context. Docker Desktop, Colima,
and Docker Engine all expose the same Docker/Compose interface. It checks Docker
and OpenBao and reports missing dependencies; it never installs or starts them.

## Two sibling containers

```text
Host: editor + Python launcher + OpenBao login + Docker CLI
  Docker engine
    dev: Nix/devenv -> Garage + Ricochet; Bun -> API + Vite
    postgres: PostgreSQL 17
```

Containers are siblings, not nested. The checkout is bind-mounted at `/workspace`;
Linux node_modules and dataflow environments use separate volumes. You can edit
outside the container and run code inside, or attach your editor to the container.
Docker publishes ports 80, 5173, 8090, and 9000 on host loopback only. Internal
services bind to `0.0.0.0` so Docker can reach the container interface. PostgreSQL
is reached as `postgres:5432` from the devcontainer and has no published host port.

## Shared dataset (default)

OpenBao's `CDN_S3_ENDPOINT`, `CDN_S3_BUCKET`, `CDN_ACCESS_KEY_ID`, and
`CDN_SECRET_ACCESS_KEY` are mapped into the ignored dataflow env files. The
allocated bucket is currently `cdn-maps`; the public URL is
`https://cdn.scottylabs.org/maps/`. `dev.py populate` reads its four
`floorplans/*.json` datasets over authenticated S3 and populates only local
PostgreSQL through the local API. It never writes to hosted storage. Raw
`source-fetch/` artifacts are separate from these processed datasets.

Run `dev.py secrets` after upgrading to fetch CDN settings. Missing CDN settings
or datasets fail before database reset. Each developer imports independently.

## Garage configuration (optional import source)

`devenv.nix` imports Kennel's shared module and enables
`scottylabs.garage.enable` and `scottylabs.ricochet.enable`. Other optional features
are disabled. Garage creates an empty `maps` bucket with public local credentials:

| Variable | Value |
| --- | --- |
| `S3_ENDPOINT` | `http://localhost:9000` |
| `S3_REGION` | `us-east-1` |
| `S3_BUCKET` | `maps` |
| `S3_ACCESS_KEY` | `GK000000000000000000000001` |
| `S3_SECRET_KEY` | SHA-256 of `maps-local-garage` |

`devenv shell` exports these variables. Garage setup does not read or update
OpenBao, and does not copy production data. Port 9000 is an S3 API, not a web
console. Use path-style bucket addressing. From inside `devenv shell`, verify:

```sh
curl --fail --silent --show-error \
  --aws-sigv4 "aws:amz:${S3_REGION}:s3" \
  --user "${S3_ACCESS_KEY}:${S3_SECRET_KEY}" \
  "${S3_ENDPOINT}/${S3_BUCKET}?list-type=2"
```

The population S3 client accepts HTTP(S) endpoints and `S3_BUCKET`. Older
unqualified endpoints default to HTTPS, and an unset bucket defaults to `cmumaps`
for existing deployments. Older scraper utilities retain their own configuration.
With `populate --source garage`, the wrapper enforces the local HTTP endpoint
and `maps` bucket. The default `populate` instead overrides these S3 variables
with the allocated CDN settings. `upload` remains local-only.

## Persistence and updates

Named volumes retain PostgreSQL, Garage, the Nix store/profile, devenv cache,
dataflow Python/cache, and Linux node_modules. Garage is mounted at
`/workspace/.devenv/state/garage`. `/tmp` is a fresh, executable tmpfs on container
restart, preventing stale devenv PID/socket files. Neither `.devenv/` nor
`uploads/` is committed or sent in the Docker build context.

`devenv.lock` pins the inputs declared in `devenv.yaml`, including Kennel and
nixpkgs. The Dockerfile bootstrap CLI uses the same nixpkgs revision; app runtimes
read the lock directly. Update deliberately inside the container:

```sh
devenv update
```

Review the lock changes, update the Dockerfile nixpkgs revision to match, and
rebuild/restart. Existing Nix volumes preserve installed profiles even when an
image is rebuilt. To replace already installed CLI/runtime versions, install the
new pinned package references into `/nix/var/nix/profiles/devenv` explicitly; an
image rebuild alone does not replace that volume. Do not delete data volumes to
update a runtime.

The scaffold is retained for future Kennel deployment. It currently configures
local services only; application deployment targets are not configured here.

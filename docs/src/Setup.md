# Running locally

The same development setup runs on macOS, Linux, and Windows using Linux
containers. Run the launcher on your host; edit the mounted checkout on your host
or in VS Code's Dev Containers extension. Bun, Node, Nix, devenv, Garage, the OAuth
relay, and the dataflow Python environment run inside the development container.
PostgreSQL runs in a second, sibling container.

## Prerequisites

Install these yourself and make their commands available in your terminal:

- Git and Python 3.9 or newer (a current Python release is recommended).
- Docker with the Compose v2 plugin (`docker compose`, not `docker-compose`).
- [OpenBao CLI](https://openbao.org/docs/install/) (`bao`) and access to the Maps
  development secrets.

The launcher checks dependencies and reports errors. It does not install Docker
or OpenBao, start a container engine, change Docker contexts, or perform your login.
You do not need host installations of Bun, Node, Nix, devenv, `jq`, or `uv`.

| Host | Container engine | Host terminal |
| --- | --- | --- |
| macOS | Docker Desktop or [Colima](https://github.com/abiosoft/colima), with Docker CLI and Compose installed | Terminal, `python3` |
| Linux | Docker Engine with Compose v2, or Docker Desktop | Terminal, `python3` |
| Windows | [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) in Linux container mode | PowerShell, `py -3` (or `python`) |
| Windows with WSL 2 | Docker Desktop with integration enabled for that distribution | WSL terminal, `python3` |

Start your chosen engine before continuing. For Colima, run `colima start`.
Verify `docker info` and `docker compose version` work in the same terminal used
for the launcher. `docker context show` identifies the selected engine; the script
uses it unchanged. Switching engines gives you a separate set of images and volumes.
For Windows/WSL, keep the checkout in the WSL Linux filesystem for better bind-mount
performance and file watching, as described in [Docker's WSL guide](https://docs.docker.com/desktop/features/wsl/).
Install Python and `bao`, and log into OpenBao, in the environment where you run
the launcher; a Windows login is not automatically a WSL login.

## Quick start

From the repository root, after starting your container engine:

### macOS, Linux, or WSL

```sh
export BAO_ADDR=https://secrets.scottylabs.org
bao login -method=oidc
python3 scripts/dev/dev.py start
```

### Windows PowerShell

```powershell
$env:BAO_ADDR = "https://secrets.scottylabs.org"
bao login -method=oidc
py -3 scripts/dev/dev.py start
```

Open [CMU Maps](http://localhost:5173). Keep the launcher terminal open for app
logs. First startup downloads packages and may take several minutes. The initial
local database and bucket are empty; load an authorized dataset using the steps
below before expecting buildings and routes.

All subsequent examples use `python3`; substitute `py -3` in PowerShell.
The old `bash scripts/dev/container.sh` command remains a macOS/Linux shortcut.

## Everyday commands

```sh
python3 scripts/dev/dev.py start --skip-secrets
python3 scripts/dev/dev.py start --rebuild
python3 scripts/dev/dev.py shell
python3 scripts/dev/dev.py logs
python3 scripts/dev/dev.py stop
```

- `start --skip-secrets` reuses the saved env files without contacting OpenBao.
- `start --rebuild` rebuilds the image after Dockerfile changes and refreshes secrets.
  Combine both flags to rebuild while reusing secrets.
- `shell` enters the container's `devenv shell`, including local S3 variables.
- `logs` follows container services (Garage, relay, PostgreSQL). App logs appear in
  the terminal running `start`.
- `stop` stops both containers, including a detached app, and preserves data.

Ctrl-C in the startup terminal stops the foreground app; service containers keep
running. If an app was started in another terminal or detached, stop that process
or use `stop` before starting again. The helper rejects duplicate starts and Vite
fails if port 5173 is occupied instead of silently moving to a different port.

For VS Code, use **Dev Containers: Reopen in Container**. The post-create hook
installs app dependencies only. Run `bash scripts/dev/container-app.sh` in the
container terminal to start the app after secrets have been downloaded on the
host. Do not run a second app if the host launcher already started one.

## What startup does

1. Checks Docker/Compose and the selected Linux container engine.
2. Checks your host OpenBao login, fetches six development values, and writes the
   server/web `.env` and `.env.local` files. It fetches and validates all values
   before replacing any file. This replaces local edits in those four files.
3. Runs Compose to start PostgreSQL and the development container. The latter
   runs `devenv up`, enabling Garage and Ricochet through Kennel's Nix module.
4. Waits for service readiness, then installs the pinned Bun/Node/OpenSSL runtimes
   into the persistent Nix profile and runs `bun install --frozen-lockfile`.
5. Generates Prisma, tsoa, and OpenAPI artifacts with `bun run sync`, then runs
   `prisma db push --skip-generate` against local PostgreSQL. It does not pass
   `--accept-data-loss`; schema changes that require it need manual review.
6. Starts the backend and web app with the container database URL overriding the
   host-oriented value in the env file. Uploading and populating data are separate,
   explicit commands.

## Secrets and login

Values come from KV v2 mount `secret`, under `secretspec/maps/dev/<NAME>`, with a
string field named `value` in each entry:

| OpenBao entry | Used as |
| --- | --- |
| `OIDC_CLIENT_ID` | Server `AUTH_CLIENT_ID` |
| `OIDC_CLIENT_SECRET` | Server `AUTH_CLIENT_SECRET` |
| `KEYCLOAK_URL`, `KEYCLOAK_REALM` | Server `AUTH_ISSUER` and `AUTH_JWKS_URI` |
| `OAUTH_RELAY_URL` | Server OAuth callback relay URL |
| `MAPKIT_TOKEN` | Web `VITE_MAPKIT_TOKEN` |

The launcher also supplies local URLs, the local PostgreSQL connection string,
and the allowed frontend origin. The web env file contains only the MapKit token
and `VITE_SERVER_URL`; client credentials stay in the server env files. Files are
ignored by Git and excluded from image builds. The OpenBao session/token remains
on your host; it is not passed into the container. POSIX env files are owner-only;
Windows files inherit your checkout's access controls. Never commit them.

OpenBao authentication and application login are separate. For browser login:

```text
Browser -> backend /api/auth -> Keycloak
Keycloak -> configured OAUTH_RELAY_URL -> local Ricochet on port 8090
Ricochet -> backend /api/auth/oauth2/callback/keycloak -> web session
```

The backend wraps the OAuth state with its return URL and binds it to a signed
cookie. It validates and unwraps the state on return. Ricochet runs through
`scottylabs.ricochet.enable` and listens on the container interface; Docker exposes
it only on your host's loopback address. Use the relay URL supplied by OpenBao
for the registered development client. These files do not provision or change
Keycloak client registrations.

Database population uses `client_credentials`, not a browser or the relay. The
Keycloak client must have a service account whose access token includes the
`/projects/maps/admins` group. The backend checks token signature, expiration,
issuer, and the required group; audience is not required by the current policy.
There is no separate password-based database-management user. The backend uses
its PostgreSQL connection to perform the authorized writes.

## Upload and populate the local database

Obtain the dataset from the team and extract it under the ignored `uploads/`
directory. Point `upload` at the folder that directly contains these files:

| Local file | Object key in Garage's `maps` bucket |
| --- | --- |
| `buildings.json` | `floorplans/buildings.json` |
| `floorplans.json` | `floorplans/floorplans.json` |
| `placements.json` | `floorplans/placements.json` |
| `all-graph.json` | `floorplans/all-graph.json` |
| `osm-pois.json` (optional) | `floorplans/osm-pois.json` |

With services and the app running, use another host terminal:

```sh
python3 scripts/dev/dev.py upload "uploads/Data/cmumaps-data/floorplans"
python3 scripts/dev/dev.py populate --check
python3 scripts/dev/dev.py populate
```

Adjust the directory to match your extraction. The upload command requires a
folder inside the checkout and uploads only those four JSON files, replacing
objects with the same keys. It does not upload an archive, `.git`, documentation,
or an entire directory tree. Add `--include-pois` to both `upload` and `populate`
to upload and import `osm-pois.json` too.

`populate --check` downloads and validates the JSON models and references, obtains
a Keycloak token, and sends an empty building batch to test backend authorization.
It does not clear tables. `populate` then clears the seven map tables and imports
buildings, floors, rooms, aliases, nodes, and edges. POIs are cleared and left empty
unless `--include-pois` is supplied. Validation happens before clearing; a later
network or write failure can still leave a partial import because the complete
operation is not one transaction. Correct the issue and rerun the import.

After population, stop and restart the app to rebuild its in-memory search index
and graph cache. Ctrl-C in its startup terminal, then:

```sh
python3 scripts/dev/dev.py start --skip-secrets
```

The JSON import does not supply missing SVG floorplan images or copy production
CDN assets. The local upload command always targets local Garage, never
`cdn.scottylabs.org`.

## Manual run

These are the same stages as the launcher, separated for inspection. Docker
commands work in PowerShell or a Unix shell. Multiline Bash blocks below run
**inside the Linux container**, regardless of your host OS.

### 1. Refresh env files on the host

Log into OpenBao as in the quick start, then run only the secrets stage:

```sh
python3 scripts/dev/dev.py secrets
```

Its implementation is `pull_secrets` and `secret_environments` in
[`scripts/dev/dev.py`](../../scripts/dev/dev.py). For each name in the table it
executes `bao kv get -format=json -mount=secret secretspec/maps/dev/<NAME>` and
reads `data.data.value`. It maps those values to the app env names above and writes
both dotenv variants. It never sources downloaded data as shell code. To manage
env files manually, use the same mappings and local constants in
`secret_environments`; do not set `SERVER_PORT`, whose schema expects a number.

### 2. Start service containers

```sh
docker compose -f .devcontainer/docker-compose.yml up -d --build dev
docker compose -f .devcontainer/docker-compose.yml logs -f dev
```

Wait for Garage and Ricochet to finish starting; Ctrl-C stops the log viewer only.
Readiness checks used by the launcher:

```sh
docker compose -f .devcontainer/docker-compose.yml exec dev devenv processes wait
docker compose -f .devcontainer/docker-compose.yml exec dev curl --fail http://127.0.0.1:8090/healthz
```

### 3. Prepare and start the application

```sh
docker compose -f .devcontainer/docker-compose.yml exec dev bash scripts/dev/container-app.sh
```

[`container-app.sh`](../../scripts/dev/container-app.sh) installs missing runtimes
from `devenv.lock`, installs Bun dependencies, and performs these core steps:

```sh
unset SERVER_PORT
export DATABASE_URL='postgresql://postgres:donotuseinprod@postgres:5432/cmumaps'
bun run sync
(cd apps/server && bunx prisma db push --skip-generate)
export LD_LIBRARY_PATH="/nix/var/nix/profiles/devenv/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
bunx turbo dev:host --env-mode=loose --filter=@cmumaps/web --filter=@cmumaps/server
```

The OpenSSL library override is applied after Prisma schema generation/push:
Bun's Nix loader needs the Nix library, while the standalone Prisma schema engine
uses Ubuntu's OpenSSL. The helper also removes stale `SERVER_PORT` assignments
from server dotenv files and guards against two app instances.

### 4. Upload manually (optional)

Enter `devenv shell` with `python3 scripts/dev/dev.py shell`. For each required
file, use the matching object key, for example:

```sh
curl --fail --silent --show-error \
  --aws-sigv4 "aws:amz:${S3_REGION}:s3" \
  --user "${S3_ACCESS_KEY}:${S3_SECRET_KEY}" \
  --upload-file uploads/Data/cmumaps-data/floorplans/buildings.json \
  "${S3_ENDPOINT}/${S3_BUCKET}/floorplans/buildings.json"
```

The upload helper repeats this for the four known filenames after checking all
are present. [Storage configuration](../../scripts/dev/README.md) describes the
local credentials and bucket.

### 5. Populate manually (optional)

With the app running, run the container helper from another terminal:

```sh
docker compose -f .devcontainer/docker-compose.yml exec -T dev bash scripts/dev/populate.sh --check
docker compose -f .devcontainer/docker-compose.yml exec -T dev bash scripts/dev/populate.sh
```

The helper installs `uv` from the Nix pin if missing, uses a dedicated Linux cache
and virtual environment, and executes this inside `devenv shell`:

```sh
export UV_CACHE_DIR=/root/.cache/cmumaps-dataflow/uv
export UV_PYTHON_INSTALL_DIR=/root/.cache/cmumaps-dataflow/python
export UV_PROJECT_ENVIRONMENT=/root/.cache/cmumaps-dataflow/venv
cd apps/dataflow
export PYTHONPATH=src
uv run --locked --only-group populate python -m deserializer --local --skip-pois --check
```

Remove `--check` to replace data; remove `--skip-pois` to include POIs. The
`populate` dependency group avoids installing scraping/geometry tools not needed
by the importer. The importer reads client credentials from `apps/server/.env`,
checks that Garage is local, and calls the local backend API. Restart the app
when finished.

## Checks and maintenance

Inside the container, generate code before application checks:

```sh
bun run sync
bun run check
bun test apps/server/src/lib/ricochetOAuth.test.ts
```

Host launcher tests require only Python:

```sh
python3 -m unittest discover -s scripts/dev/tests -v
```

The launcher workflow runs these contract tests on Windows, Linux, and macOS.
They mock Docker/OpenBao; they do not replace an engine integration test. Dataflow
checks are described in [its README](../../apps/dataflow/README.md).

Named volumes preserve PostgreSQL, Garage, Nix packages, and caches across
container recreation. `stop` and `docker compose ... down` retain those volumes;
`down --volumes` deletes them. Keep local datasets under `uploads/` and secrets
in ignored env files. See [Troubleshooting](Troubleshooting.md) for startup issues.

The older native-host `bun run dev:*` and `secrets:*` commands remain for existing
workflows; they require host runtimes and may use the older Vault paths. The
container quick start above uses the current Secretspec/OpenBao entries.

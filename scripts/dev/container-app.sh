#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."
if [[ ! -f /.dockerenv ]]; then
  echo "Run this helper inside the devcontainer. On your host, use scripts/dev/container.sh." >&2
  exit 1
fi

# Prevent a second startup from racing dependency generation or claiming ports.
exec 9>/tmp/cmumaps-app.lock
if ! flock -n 9; then
  if [[ "${1:-}" == "--dependencies-only" ]]; then
    echo "App setup is already running or complete; reusing its dependencies."
    exit 0
  fi
  echo "App preparation/startup is already running. Use its terminal or stop the containers before restarting." >&2
  exit 1
fi
if [[ "${1:-}" != "--dependencies-only" ]] && \
  [[ -n "$(ss -ltnH 'sport = :80 or sport = :5173')" ]]; then
  echo "Port 80 or 5173 is already used inside the container. Stop the existing app before starting another." >&2
  exit 1
fi

# Install app runtimes into the persistent Nix profile, using the scaffold's pin.
nixpkgs_rev=$(jq -er '.nodes[.nodes.root.inputs.nixpkgs].locked.rev' devenv.lock)
if ! command -v bun >/dev/null || ! command -v node >/dev/null; then
  nix profile install --profile /nix/var/nix/profiles/devenv \
    "github:NixOS/nixpkgs/$nixpkgs_rev#bun" \
    "github:NixOS/nixpkgs/$nixpkgs_rev#nodejs_22"
fi

# Nix's Bun loader does not search the host distro's library directories when
# Prisma loads its native query engine. Use OpenSSL from the same Nix pin.
if [[ ! -f /nix/var/nix/profiles/devenv/lib/libssl.so.3 ]]; then
  openssl_library_path=$(nix build --no-link --print-out-paths \
    "github:NixOS/nixpkgs/$nixpkgs_rev#openssl^out")
  nix profile install --profile /nix/var/nix/profiles/devenv "$openssl_library_path"
fi

bun install --frozen-lockfile
if [[ "${1:-}" == "--dependencies-only" ]]; then
  exit 0
fi

for app in server web; do
  if [[ ! -s "apps/$app/.env" ]]; then
    echo "Missing apps/$app/.env. Run scripts/dev/container.sh on your host first." >&2
    exit 1
  fi
done

# Bun also loads .env.local. Zod's SERVER_PORT currently requires a number,
# so let it default to 80 rather than loading a string from either file.
unset SERVER_PORT
for env_file in apps/server/.env apps/server/.env.local; do
  if [[ -f "$env_file" ]] && grep -Eq '^[[:space:]]*(export[[:space:]]+)?SERVER_PORT[[:space:]]*=' "$env_file"; then
    umask 077
    env_tmp=$(mktemp)
    trap 'rm -f "$env_tmp"' EXIT
    sed '/^[[:space:]]*\(export[[:space:]]\+\)\?SERVER_PORT[[:space:]]*=/d' "$env_file" > "$env_tmp"
    # Preserve the host file's owner and permissions rather than replacing it.
    cat "$env_tmp" > "$env_file"
    rm -f "$env_tmp"
    trap - EXIT
  fi
done
export DATABASE_URL='postgresql://postgres:donotuseinprod@postgres:5432/cmumaps'

bun run sync
(cd apps/server && bunx prisma db push --skip-generate)

# Apply this only to the Bun app. Prisma's standalone schema engine uses the
# distro loader and must keep using the distro's OpenSSL during db push.
export LD_LIBRARY_PATH="/nix/var/nix/profiles/devenv/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"

echo "Starting web at http://localhost:5173 and API at http://localhost:80"
# Preserve DATABASE_URL through Turbo so pulled host settings cannot override it.
export TURBO_UI=stream
exec bunx turbo dev:host --env-mode=loose --filter=@cmumaps/web --filter=@cmumaps/server

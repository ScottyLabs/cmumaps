#!/usr/bin/env python3
"""Portable host entry point; app runtimes and Linux helpers live in Docker."""

import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[2]
COMPOSE = ["docker", "compose", "-f", str(ROOT / ".devcontainer/docker-compose.yml")]
SECRET_NAMES = (
    "OIDC_CLIENT_ID",
    "OIDC_CLIENT_SECRET",
    "KEYCLOAK_URL",
    "KEYCLOAK_REALM",
    "MAPKIT_TOKEN",
    "OAUTH_RELAY_URL",
)


def run(args, *, capture=False, quiet=False, timeout=None, env=None):
    """Pass arguments directly, including paths with spaces, without a shell."""
    return subprocess.run(
        args,
        cwd=ROOT,
        env=env,
        check=True,
        text=True,
        encoding="utf-8",
        stdout=subprocess.PIPE if capture else subprocess.DEVNULL if quiet else None,
        stderr=subprocess.DEVNULL if quiet or capture else None,
        timeout=timeout,
    )


def require_tool(name):
    if not shutil.which(name):
        raise RuntimeError(f"Install {name} and put it on PATH; see docs/src/Setup.md.")


def docker_ready():
    require_tool("docker")
    try:
        run(COMPOSE + ["version"], quiet=True, timeout=20)
        result = run(
            ["docker", "info", "--format", "{{.OSType}}"], capture=True, timeout=20
        )
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as error:
        raise RuntimeError(
            "Docker Compose or the Docker engine is unavailable. Start Docker Desktop "
            "(Linux containers), Colima ('colima start'), or Docker Engine. "
            "Check 'docker context show' and 'docker compose version'."
        ) from error
    if result.stdout.strip() != "linux":
        raise RuntimeError(
            "This project needs Linux containers. Switch Docker Desktop to Linux containers."
        )


def dotenv(values):
    # All consumers support quoted dotenv values. Reject control characters so
    # a malformed secret cannot add another assignment or change parsing.
    for value in values.values():
        if any(ord(char) < 32 or ord(char) == 127 for char in value):
            raise RuntimeError(
                "An OpenBao value contains unsupported control characters."
            )
        if any(char in value for char in ('"', "\\", "`")):
            raise RuntimeError(
                "An OpenBao value contains unsupported dotenv quoting characters."
            )
    return "".join(f'{name}="{value}"\n' for name, value in values.items())


def secret_environments(values):
    issuer = values["KEYCLOAK_URL"].rstrip("/") + "/realms/" + values["KEYCLOAK_REALM"]
    server = {
        "ALLOWED_ORIGINS_REGEX": "^http://(localhost|127[.]0[.]0[.]1):5173$",
        "AUTH_CLIENT_ID": values["OIDC_CLIENT_ID"],
        "AUTH_CLIENT_SECRET": values["OIDC_CLIENT_SECRET"],
        "AUTH_ISSUER": issuer,
        "AUTH_JWKS_URI": issuer + "/protocol/openid-connect/certs",
        "OAUTH_RELAY_URL": values["OAUTH_RELAY_URL"],
        "BETTER_AUTH_URL": "http://localhost:5173",
        "DATABASE_URL": "postgresql://postgres:donotuseinprod@localhost:5432/cmumaps",
        "SERVER_URL": "http://localhost",
    }
    web = {
        "VITE_SERVER_URL": "http://localhost",
        "VITE_MAPKIT_TOKEN": values["MAPKIT_TOKEN"],
    }
    return {"server": dotenv(server), "web": dotenv(web)}


def write_env(path, content):
    # Replace each file atomically and use LF even on Windows. mkstemp uses
    # owner-only POSIX permissions; Windows uses the user's directory ACLs.
    descriptor, temporary = tempfile.mkstemp(dir=path.parent, prefix=".env.tmp-")
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8", newline="\n") as file:
            file.write(content)
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def pull_secrets():
    require_tool("bao")
    environment = dict(os.environ)
    environment.setdefault("BAO_ADDR", "https://secrets.scottylabs.org")
    try:
        run(["bao", "token", "lookup"], quiet=True, env=environment, timeout=30)
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as error:
        raise RuntimeError(
            "Log into OpenBao first: set BAO_ADDR, then run 'bao login -method=oidc'."
        ) from error
    print(
        "Downloading development secrets from secret/secretspec/maps/dev...", flush=True
    )
    values = {}
    for name in SECRET_NAMES:
        try:
            result = run(
                [
                    "bao",
                    "kv",
                    "get",
                    "-format=json",
                    "-mount=secret",
                    f"secretspec/maps/dev/{name}",
                ],
                capture=True,
                env=environment,
                timeout=30,
            )
            value = json.loads(result.stdout)["data"]["data"]["value"]
            if not isinstance(value, str) or not value:
                raise ValueError("Missing value")
            if "$" in value:
                raise ValueError("Unsupported dotenv expansion character")
            values[name] = value
        except (
            subprocess.CalledProcessError,
            subprocess.TimeoutExpired,
            ValueError,
            KeyError,
            TypeError,
        ) as error:
            raise RuntimeError(
                f"Cannot read secret/secretspec/maps/dev/{name}. Check maps-dev access "
                "and the entry's nonempty 'value' field. Existing env files were not changed."
            ) from error
    # Fetch and validate everything before replacing any file. Never print values.
    environments = secret_environments(values)
    for app, content in environments.items():
        for filename in (".env", ".env.local"):
            write_env(ROOT / "apps" / app / filename, content)
    print(
        "Updated server/web .env and .env.local. OpenBao login stays on the host.",
        flush=True,
    )


def wait_services():
    print(
        "Waiting for Garage and Ricochet (first startup can take several minutes)...",
        flush=True,
    )
    deadline = time.monotonic() + 600
    while time.monotonic() < deadline:
        try:
            run(
                COMPOSE + ["exec", "-T", "dev", "devenv", "processes", "wait"],
                quiet=True,
                timeout=10,
            )
            run(
                COMPOSE
                + [
                    "exec",
                    "-T",
                    "dev",
                    "curl",
                    "--fail",
                    "--silent",
                    "--max-time",
                    "2",
                    "http://127.0.0.1:8090/healthz",
                ],
                quiet=True,
                timeout=10,
            )
            return
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
            time.sleep(5)
    raise RuntimeError(
        "Services did not become ready within 10 minutes. Run this script with 'logs'."
    )


def execute_helper(name, arguments=(), interactive=False):
    options = (
        [] if interactive and sys.stdin.isatty() and sys.stdout.isatty() else ["-T"]
    )
    run(
        COMPOSE
        + ["exec"]
        + options
        + ["dev", "bash", f"scripts/dev/{name}"]
        + list(arguments)
    )


def start(args):
    docker_ready()
    if not args.skip_secrets:
        pull_secrets()
    for app in ("server", "web"):
        path = ROOT / "apps" / app / ".env"
        if not path.is_file() or not path.stat().st_size:
            raise RuntimeError(
                f"Missing apps/{app}/.env. Run without --skip-secrets after OpenBao login."
            )
    print(
        "Starting devcontainer and PostgreSQL using the active Docker context...",
        flush=True,
    )
    run(COMPOSE + ["up", "-d"] + (["--build"] if args.rebuild else []) + ["dev"])
    wait_services()
    print(
        "Starting app. Ctrl-C stops the app; containers and stored data remain.",
        flush=True,
    )
    execute_helper("container-app.sh", interactive=True)


def upload(args):
    directory = Path(args.directory).resolve()
    try:
        relative = directory.relative_to(ROOT)
    except ValueError as error:
        raise RuntimeError(
            "Put the extracted dataset inside this checkout (for example uploads/floorplans)."
        ) from error
    names = ["buildings.json", "floorplans.json", "placements.json", "all-graph.json"]
    if args.include_pois:
        names.append("osm-pois.json")
    for name in names:
        if not (directory / name).is_file():
            raise RuntimeError(f"Missing input: {directory / name}")
    docker_ready()
    execute_helper(
        "upload.sh",
        ["/workspace/" + relative.as_posix()]
        + (["--include-pois"] if args.include_pois else []),
    )


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    startup = commands.add_parser(
        "start", help="Refresh secrets, start services, prepare and run the app"
    )
    startup.add_argument(
        "--skip-secrets", action="store_true", help="Reuse existing .env files"
    )
    startup.add_argument(
        "--rebuild", action="store_true", help="Rebuild the Docker image"
    )
    commands.add_parser(
        "secrets", help="Only refresh server/web env files from OpenBao"
    )
    populate = commands.add_parser(
        "populate", help="Replace local map tables from Garage; restart app afterwards"
    )
    populate.add_argument(
        "--check",
        action="store_true",
        help="Validate data and authorization without clearing tables",
    )
    populate.add_argument(
        "--include-pois", action="store_true", help="Require and import osm-pois.json"
    )
    uploader = commands.add_parser(
        "upload", help="Upload the four dataset JSON files to local Garage"
    )
    uploader.add_argument(
        "directory", help="Extracted dataset directory inside this checkout"
    )
    uploader.add_argument(
        "--include-pois", action="store_true", help="Also upload osm-pois.json"
    )
    commands.add_parser("stop", help="Stop both containers, preserving volumes")
    commands.add_parser("logs", help="Follow Garage, relay, and PostgreSQL logs")
    commands.add_parser("shell", help="Enter the container's Kennel/devenv shell")
    args = parser.parse_args(argv)
    try:
        if args.command == "start":
            start(args)
        elif args.command == "secrets":
            pull_secrets()
        elif args.command == "upload":
            upload(args)
        else:
            docker_ready()
            if args.command == "populate":
                options = (["--check"] if args.check else []) + (
                    ["--include-pois"] if args.include_pois else []
                )
                execute_helper("populate.sh", options)
                if not args.check:
                    print(
                        "Import complete. Restart the app to refresh its search index and graph cache."
                    )
            elif args.command == "shell":
                options = [] if sys.stdin.isatty() and sys.stdout.isatty() else ["-T"]
                run(COMPOSE + ["exec"] + options + ["dev", "devenv", "shell"])
            elif args.command == "stop":
                run(COMPOSE + ["stop"])
            elif args.command == "logs":
                run(COMPOSE + ["logs", "--follow", "--tail", "100"])
    except (RuntimeError, OSError, subprocess.TimeoutExpired) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    except subprocess.CalledProcessError as error:
        print(
            f"Command failed (exit {error.returncode}); see output above.",
            file=sys.stderr,
        )
        return 1
    except KeyboardInterrupt:
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main())

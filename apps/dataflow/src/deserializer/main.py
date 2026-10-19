"""Main module for the deserializer application."""

import argparse
import os
from collections.abc import Callable
from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit

import dotenv

from clients import ALL_TABLE_NAMES, TableName, get_api_client_singleton
from logger import log_operation, print_section

from .preflight import validate_sources
from .tables import (
    populate_alias_table,
    populate_building_table,
    populate_edge_table,
    populate_floor_table,
    populate_node_table,
    populate_poi_table,
    populate_room_table,
)

dotenv.load_dotenv()
LOCAL_GARAGE_PORT = 9000


def populate_table(
    table_name: TableName,
    populate_function: Callable[[], None],
) -> None:
    """Populate a table with the given function."""
    print_section(f"Populating {table_name} table")
    with log_operation(f"populate {table_name} table"):
        populate_function()


def main() -> None:
    """Entry point to populate the tables."""
    parser = argparse.ArgumentParser(
        description="Replace map data from S3 JSON datasets",
    )
    parser.add_argument(
        "--skip-pois",
        action="store_true",
        help="Leave POIs empty after reset",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Preflight only; do not clear or import data",
    )
    parser.add_argument(
        "--local",
        action="store_true",
        help="Import into the local backend using devcontainer credentials",
    )
    parser.add_argument(
        "--source",
        choices=("cdn", "garage"),
        help="With --local: read hosted CDN (default) or local Garage",
    )
    args = parser.parse_args()
    if args.source and not args.local:
        parser.error("--source requires --local")
    if args.local:
        configure_local(source=args.source or "cdn")
    with log_operation("validate source datasets"):
        validate_sources(skip_pois=args.skip_pois)
    api_client = get_api_client_singleton()
    with log_operation("check backend authorization"):
        api_client.preflight()
    if args.check:
        return

    with log_operation("drop tables"):
        if not api_client.drop_tables(ALL_TABLE_NAMES):
            msg = "Database reset failed; population aborted"
            raise RuntimeError(msg)

    populate_table("Building", populate_building_table)
    populate_table("Floor", populate_floor_table)
    populate_table("Room", populate_room_table)
    populate_table("Alias", populate_alias_table)
    populate_table("Node", populate_node_table)
    populate_table("Edge", populate_edge_table)
    if not args.skip_pois:
        populate_table("Poi", populate_poi_table)


def configure_local(*, source: Literal["cdn", "garage"] = "cdn") -> None:
    """Read backend credentials without executing dotenv files as shell code."""
    apps = Path(__file__).resolve().parents[3]
    server_env = apps / "server" / ".env"
    values = dotenv.dotenv_values(server_env)
    for name in ("AUTH_CLIENT_ID", "AUTH_CLIENT_SECRET", "AUTH_ISSUER"):
        value = values.get(name)
        if not value:
            msg = (
                f"Missing {name} in {server_env}; run scripts/dev/dev.py secrets first"
            )
            raise ValueError(msg)
        os.environ[name] = value
    if source == "cdn":
        configure_cdn(apps / "dataflow" / ".env")
    else:
        validate_local_garage()
    # A shared data source must never turn this into a remote database reset.
    os.environ["SERVER_URL"] = "http://localhost"


def configure_cdn(env_file: Path) -> None:
    """Override inherited Garage/legacy settings with the allocated CDN values."""
    values = dotenv.dotenv_values(env_file)
    names = ("S3_ENDPOINT", "S3_BUCKET", "S3_ACCESS_KEY", "S3_SECRET_KEY")
    for name in names:
        if not values.get(name):
            msg = f"Missing {name} in {env_file}; run scripts/dev/dev.py secrets first"
            raise ValueError(msg)
    endpoint = urlsplit(values["S3_ENDPOINT"] or "")
    if endpoint.scheme != "https" or not endpoint.hostname:
        msg = "Hosted CDN requires an HTTPS S3_ENDPOINT in the dataflow env file"
        raise ValueError(msg)
    for name in names:
        os.environ[name] = str(values[name])
    # Do not inherit Garage's region; let the S3 SDK discover the hosted region.
    os.environ.pop("S3_REGION", None)
    if values.get("S3_REGION"):
        os.environ["S3_REGION"] = str(values["S3_REGION"])


def validate_local_garage() -> None:
    """Keep the explicit Garage alternative isolated from hosted storage."""
    endpoint = urlsplit(os.getenv("S3_ENDPOINT", ""))
    if (
        endpoint.scheme != "http"
        or endpoint.hostname not in {"localhost", "127.0.0.1"}
        or endpoint.port != LOCAL_GARAGE_PORT
        or os.getenv("S3_BUCKET") != "maps"
    ):
        msg = (
            "Local population requires Garage at http://localhost:9000, "
            "bucket maps; use devenv shell"
        )
        raise ValueError(msg)

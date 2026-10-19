"""Main module for the deserializer application."""

import argparse
import os
from collections.abc import Callable
from pathlib import Path
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
        "--skip-pois", action="store_true", help="Leave POIs empty after reset",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Preflight only; do not clear or import data",
    )
    parser.add_argument(
        "--local",
        action="store_true",
        help="Use devcontainer backend credentials and local Garage",
    )
    args = parser.parse_args()
    if args.local:
        configure_local()
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


def configure_local() -> None:
    """Read backend credentials without executing dotenv files as shell code."""
    source = Path(__file__).resolve().parents[3] / "server" / ".env"
    values = dotenv.dotenv_values(source)
    for name in ("AUTH_CLIENT_ID", "AUTH_CLIENT_SECRET", "AUTH_ISSUER"):
        value = values.get(name)
        if not value:
            msg = f"Missing {name} in {source}; run scripts/dev/container.sh first"
            raise ValueError(msg)
        os.environ[name] = value
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
    os.environ["SERVER_URL"] = "http://localhost"

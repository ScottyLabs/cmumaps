"""Main module for the deserializer application."""

from collections.abc import Callable  # noqa: TC003

import dotenv

from clients import ALL_TABLE_NAMES, TableName, get_api_client_singleton
from logger import log_operation, print_section

from .tables import (
    populate_alias_table,
    populate_building_table,
    populate_edge_table,
    populate_floor_table,
    populate_node_table,
    populate_room_table,
)

dotenv.load_dotenv()


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
    api_client = get_api_client_singleton()

    with log_operation("drop tables"):
        api_client.drop_tables(ALL_TABLE_NAMES)

    populate_table("Building", populate_building_table)
    populate_table("Floor", populate_floor_table)
    populate_table("Room", populate_room_table)
    populate_table("Alias", populate_alias_table)
    populate_table("Node", populate_node_table)
    populate_table("Edge", populate_edge_table)

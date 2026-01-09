from typing import TYPE_CHECKING

import dotenv

from clients import ALL_TABLE_NAMES, TableName, get_api_client_singleton
from logger import log_operation
from logger.app_logger import get_app_logger
from logger.utils import print_section

from .tables.alias import populate_alias_table
from .tables.building import populate_building_table
from .tables.floor import populate_floor_table
from .tables.room import populate_room_table

if TYPE_CHECKING:
    from collections.abc import Callable

dotenv.load_dotenv()


def populate_table(table_name: TableName, populate_function: Callable) -> None:
    print_section(f"Populating {table_name} table")
    with log_operation(f"populate {table_name} table"):
        populate_function()


def main() -> None:
    logger = get_app_logger()
    api_client = get_api_client_singleton()

    if not api_client.drop_tables(ALL_TABLE_NAMES):
        msg = "Failed to drop tables"
        logger.critical(msg)
        raise RuntimeError(msg)

    populate_table("Building", populate_building_table)
    populate_table("Floor", populate_floor_table)
    populate_table("Room", populate_room_table)
    populate_table("Alias", populate_alias_table)
    # populate_table("Node", populate_node_table)
    # populate_table("Edge", populate_edge_table)

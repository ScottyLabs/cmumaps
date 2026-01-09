import dotenv

from clients import ALL_TABLE_NAMES, get_api_client_singleton
from logger import log_operation
from logger.app_logger import get_app_logger
from logger.utils import print_section

from .tables.building import populate_building_table

dotenv.load_dotenv()


def main() -> None:
    logger = get_app_logger()
    api_client = get_api_client_singleton()

    if not api_client.drop_tables(ALL_TABLE_NAMES):
        msg = "Failed to drop tables"
        logger.critical(msg)
        raise RuntimeError(msg)

    try:
        with log_operation("Populating building table"):
            populate_building_table()
    except Exception as e:
        msg = "Failed to populate building table"
        logger.critical(msg)
        raise RuntimeError(msg) from e

    print_section("Creating floors")
    # create_floors(api_client)

    print_section("Creating rooms")
    # create_rooms(api_client)

    print_section("Creating aliases")
    # create_aliases(api_client)

    print_section("Creating nodes")
    # create_nodes(api_client)

    print_section("Creating edges")
    # create_edges(api_client)


if __name__ == "__main__":
    main()

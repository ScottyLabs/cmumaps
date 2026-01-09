import dotenv

from clients.api_client import ApiClient
from logger import log_operation
from logger.utils import print_section

# from .alias import create_aliases
# from .building import create_buildings
# from .edge import create_edges
# from .floor import create_floors
# from .node import create_nodes
# from .room import create_rooms

dotenv.load_dotenv()


def main() -> None:
    api_client = ApiClient()

    with log_operation("drop all tables"):
        api_client.drop_all_tables()

    print_section("Creating buildings")
    # create_buildings(api_client)

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

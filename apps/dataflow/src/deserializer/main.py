# Script that combines other json-to-database scripts to populate entire database
# python floorplans/deserializer/database_population.py <env>
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import requests  # type: ignore
from alias import create_aliases
from building import create_buildings
from edge import create_edges
from floor import create_floors
from node import create_nodes
from room import create_rooms

from auth_utils.api_client import ClerkTokenManager


def drop_all_tables(clerk_manager):
    table_names = ["Building", "Floor", "Room", "Alias", "Node", "Edge", "Poi"]
    server_url = clerk_manager.server_url
    response = requests.delete(
        f"{server_url}/drop-tables",
        json={"tableNames": table_names},
        headers={"Authorization": f"Bearer {clerk_manager.get_clerk_token()}"},
    )
    print(response.json())


def main():
    clerk_manager = ClerkTokenManager(env_name)

    drop_all_tables(clerk_manager)

    # Populate all tables
    create_buildings(clerk_manager)
    print("created buildings")
    create_floors(clerk_manager)
    print("created floors")
    create_rooms(clerk_manager)
    print("created rooms")
    create_aliases(clerk_manager)
    print("created aliases")
    create_nodes(clerk_manager)
    print("created nodes")
    create_edges(clerk_manager)
    print("created edges")


if __name__ == "__main__":
    main()

# Script that combines other json-to-database scripts to populate entire database
# python scripts/json-to-database/database-population.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import asyncio
import requests  # type: ignore
from auth_utils.get_clerk_jwt import get_clerk_jwt
from building import create_building
from floor import create_floor
from room import create_rooms
from alias import create_alias
from node import create_nodes
from edge import create_edges


def drop_all_tables():
    table_names = ["Building", "Floor", "Room", "Alias", "Node", "Edge", "Poi"]
    server_url = os.getenv("SERVER_URL")
    response = requests.delete(
        f"{server_url}/api/drop-tables",
        json={"tableNames": table_names},
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response.json())


if __name__ == "__main__":
    drop_all_tables()

    # Populate all tables
    asyncio.run(create_building())
    print("created buildings")
    asyncio.run(create_floor())
    print("created floors")
    asyncio.run(create_rooms())
    print("created rooms")
    asyncio.run(create_alias())
    print("created aliases")
    asyncio.run(create_nodes())
    print("created nodes")
    asyncio.run(create_edges())
    print("created edges")

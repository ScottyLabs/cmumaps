# create Alias table of the database using floorPlanMap.json
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import json
import requests  # type: ignore
from auth_utils.get_clerk_jwt import get_clerk_jwt


# Drop and populate Alias table
def drop_alias_table():
    server_url = os.getenv("SERVER_URL")
    response = requests.delete(
        f"{server_url}/api/drop-tables",
        json={"tableNames": ["Alias"]},
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response.json())


def create_aliases():
    with open("cmumaps-data/floorplans/floorplans.json", "r") as file:
        data = json.load(file)

    alias_data = []
    for building in data:
        # skip empty buildings
        if not data[building]:
            continue

        # skip outside because we will be using OSM
        if building == "outside":
            continue

        for floor in data[building]:
            for room_id in data[building][floor]:
                room = data[building][floor][room_id]
                displayAlias = "" if not room["aliases"] else room["aliases"][0]

                roomId = room["id"]
                for alias in room["aliases"]:
                    if alias:
                        alias_data.append(
                            {
                                "alias": alias,
                                "roomId": roomId,
                                "isDisplayAlias": alias == displayAlias,
                            }
                        )

    # Send request to server to populate Alias table
    server_url = os.getenv("SERVER_URL")
    response = requests.post(
        f"{server_url}/api/populate-table/alias",
        json=alias_data,
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response)
    print(response.json())


if __name__ == "__main__":
    drop_alias_table()
    create_aliases()

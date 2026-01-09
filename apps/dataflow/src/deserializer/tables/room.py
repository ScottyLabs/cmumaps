# Script to populate the Rooms table
# skip empty buildings and outside
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import json
import requests  # type: ignore
from s3_utils.s3_utils import get_json_from_s3


# Drop and populate Element and Room tables
def drop_room_table(clerk_manager):
    server_url = clerk_manager.server_url
    response = requests.delete(
        f"{server_url}/drop-tables",
        json={"tableNames": ["Room"]},
        headers={"Authorization": f"Bearer {clerk_manager.get_clerk_token()}"},
    )
    print(response.json())


def create_rooms(clerk_manager):
    data = get_json_from_s3("floorplans/floorplans.json", return_data=True)

    # Populate Room data
    for building in data:
        # skip empty buildings
        if not data[building]:
            continue

        # skip outside because we will be using OSM
        if building == "outside":
            continue

        rooms_data = []
        for floor in data[building]:
            for room in data[building][floor]:
                roomdata = data[building][floor][room]
                roomId = roomdata["id"]
                labelLatitude = roomdata["labelPosition"]["latitude"]
                labelLongitude = roomdata["labelPosition"]["longitude"]
                type = roomdata["type"]
                buildingCode = roomdata["floor"]["buildingCode"]
                floorLevel = roomdata["floor"]["level"]
                name = roomdata["name"]
                polygon = json.dumps(roomdata["coordinates"])

                room = {
                    "roomId": roomId,
                    "name": name,
                    "type": type,
                    "labelLatitude": labelLatitude,
                    "labelLongitude": labelLongitude,
                    "polygon": polygon,
                    "buildingCode": buildingCode,
                    "floorLevel": floorLevel,
                }

                rooms_data.append(room)

        # Send request to server to populate Room table
        server_url = clerk_manager.server_url
        response = requests.post(
            f"{server_url}/populate-table/rooms",
            json=rooms_data,
            headers={"Authorization": f"Bearer {clerk_manager.get_clerk_token()}"},
        )
        print(building)
        print(response)
        print(response.json())

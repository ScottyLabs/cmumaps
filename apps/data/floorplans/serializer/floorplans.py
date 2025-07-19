# Script to create a serialized version of floorplans.json from the database.
# python floorplans/serializer/floorplans.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_jwt import get_clerk_jwt

import requests
import json


def floorplans_serializer(floor_code: str = None):
    """
    Fetches floor data from the server and saves it to the floorplans_serialized.json
    Optionally, if a floor code in the format of 'GHC-3' is provided,
    updates that floor in floorplans.json directly.
    """

    server_url = os.getenv("SERVER_URL")

    headers = {
        "Authorization": f"Bearer {get_clerk_jwt()}",
    }

    # Update specific floor in floorplans_serializer.json
    if floor_code:
        building_code = floor_code.split("-")[0]
        floor_level = floor_code.split("-")[1]
        file_to_update = "cmumaps-data/floorplans/floorplans-serialized.json"
        rooms_response = requests.get(
            f"{server_url}/api/floors/{floor_code}/rooms", headers=headers
        )
        rooms_response.raise_for_status()
        rooms = rooms_response.json()

        with open(file_to_update, "r") as f:
            floorplans_data = json.load(f)
        for room in rooms:
            room_info = rooms[room]
            room_name = room_info["name"]
            roomId = room

            new_room_dict = {
                "name": room_name,
                "labelPosition": {
                    "latitude": room_info["labelPosition"]["latitude"],
                    "longitude": room_info["labelPosition"]["longitude"],
                },
                "type": room_info["type"],
                "id": roomId,
                "floor": {"buildingCode": building_code, "level": floor_level},
                "coordinates": room_info["polygon"],
                "aliases": room_info["aliases"],
            }
            # Update room
            floorplans_data.setdefault(building_code, {}).setdefault(
                str(floor_level), {}
            )[roomId] = new_room_dict
        with open(file_to_update, "w") as f:
            json.dump(floorplans_data, f, indent=2)

    else:  # Update all
        floorplans_dict = {}
        all_buildings = requests.get(f"{server_url}/api/buildings", headers=headers)
        all_buildings.raise_for_status()  # debugging
        buildings = all_buildings.json()
        all_floor_codes = []
        for building in buildings:
            floors = buildings[building]["floors"]
            for floor in floors:
                floor_code = f"{building}-{floor}"
                all_floor_codes.append(floor_code)

        for floor_code in all_floor_codes:
            building_code = floor_code.split("-")[0]
            floor_level = floor_code.split("-")[1]
            rooms_response = requests.get(
                f"{server_url}/api/floors/{floor_code}/rooms", headers=headers
            )
            rooms_response.raise_for_status()
            rooms = rooms_response.json()
            for room in rooms:
                room_info = rooms[room]
                room_name = room_info["name"]
                roomId = room

                new_room_dict = {
                    "name": room_name,
                    "labelPosition": {
                        "latitude": room_info["labelPosition"]["latitude"],
                        "longitude": room_info["labelPosition"]["longitude"],
                    },
                    "type": room_info["type"],
                    "id": roomId,
                    "floor": {"buildingCode": building_code, "level": floor_level},
                    "coordinates": room_info["polygon"],
                    "aliases": room_info["aliases"],
                }
                if building_code not in floorplans_dict:
                    floorplans_dict[building_code] = {}
                if floor_level not in floorplans_dict[building_code]:
                    floorplans_dict[building_code][floor_level] = {}
                floorplans_dict[building_code][floor_level][room] = new_room_dict

        # Create serialized json file and save
        with open("cmumaps-data/floorplans/floorplans-serialized.json", "w") as f:
            json.dump(floorplans_dict, f, indent=4)

    return


if __name__ == "__main__":
    floorplans_serializer(floor_code=None)

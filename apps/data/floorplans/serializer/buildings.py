# Script to create a serialized version of buildings.json from the database.
# python floorplans/serializer/buildings.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.api_client import get_api_client

import json


def buildings_serializer():
    """
    Fetches floor data from the server and saves it to the buildings-serialized.json
    """

    buildings = get_api_client(path="buildings")

    with open("cmumaps-data/floorplans/buildings.json", "r") as f:
        buildings_data = json.load(f)

    all_buildings_data = {}

    for building in buildings:
        building_info = buildings[building]

        # populate building_dict
        building_dict = {}
        building_dict["name"] = building_info["name"]
        building_dict["floors"] = building_info["floors"]
        building_dict["labelPosition"] = {
            "latitude": building_info["labelLatitude"],
            "longitude": building_info["labelLongitude"],
        }
        building_dict["shapes"] = building_info["shape"]
        building_dict["hitbox"] = building_info["hitbox"]
        building_dict["code"] = building_info["code"]
        if "osmId" in buildings_data:
            building_dict["osmId"] = buildings_data["osmId"]
        if building_info["defaultFloor"]:
            building_dict["defaultFloor"] = building_info["defaultFloor"]
        if building_info["defaultOrdinal"]:
            building_dict["defaultOrdinal"] = building_info["defaultOrdinal"]

        all_buildings_data[building] = building_dict

    # Save file
    with open("cmumaps-data/floorplans/buildings-serialized.json", "w") as f:
        json.dump(all_buildings_data, f, indent=4)

    return


if __name__ == "__main__":
    buildings_serializer()

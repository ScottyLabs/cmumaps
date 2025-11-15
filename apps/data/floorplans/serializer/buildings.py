# Script to create a serialized version of buildings.json from the database.
# python floorplans/serializer/buildings.py
import os
import sys
import requests

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_token import get_clerk_token
from s3_utils.s3_utils import upload_json_file, get_json_from_s3

import json

server_url = os.getenv("SERVER_URL")


def buildings_serializer():
    """
    Fetches floor data from the server and saves it to the buildings-serialized.json
    """

    response_buildings = requests.get(
        f"{server_url}/buildings",
        headers={"Authorization": f"Bearer {get_clerk_token()}"},
    )
    buildings = response_buildings.json()

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
        # if "osmId" in buildings_data:
        #     building_dict["osmId"] = buildings_data["osmId"]
        if building_info["defaultFloor"]:
            building_dict["defaultFloor"] = building_info["defaultFloor"]
        if building_info["defaultOrdinal"]:
            building_dict["defaultOrdinal"] = building_info["defaultOrdinal"]

        all_buildings_data[building] = building_dict

    # Save file
    with open("cmumaps-data/floorplans/buildings-serialized.json", "w") as f:
        json.dump(all_buildings_data, f, indent=4)
    # Merge files
    original_buildings_data = get_json_from_s3(
        "floorplans/buildings.json", return_data=True
    )
    with open("cmumaps-data/floorplans/buildings-serialized.json", "r") as f:
        new_buildings_data = json.load(f)
    new_buildings_data.update(original_buildings_data)
    # Save file
    with open("cmumaps-data/floorplans/buildings-serialized.json", "w") as f:
        json.dump(new_buildings_data, f, indent=4)
    upload_json_file(
        local_file_path="cmumaps-data/floorplans/buildings-serialized.json",
        s3_object_name="floorplans/buildings-serialized.json",
    )

    return


if __name__ == "__main__":
    buildings_serializer()

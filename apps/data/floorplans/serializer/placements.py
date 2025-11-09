# Script to create a serialized version of placements.json from the database.
# python floorplans/serializer/placements.py
import os
import sys
import requests

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_jwt import get_clerk_jwt
from s3_utils.s3_utils import upload_json_file

import json

server_url = os.getenv("SERVER_URL")


def placements_serializer():
    """
    Fetches floor data from the server and saves it to the placements-serialized.json
    """
    all_floors_data = {}

    response_buildings = requests.get(
        f"{server_url}/buildings",
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    buildings = response_buildings.json()

    for building in buildings:
        if buildings[building]["floors"]:
            building_code = buildings[building]["code"]
            floor_levels = buildings[building]["floors"]
            all_floors_data[building_code] = {}

            for floor_level in floor_levels:
                floor_code = f"{building_code}-{floor_level}"
                response_floor_info = requests.get(
                    f"{server_url}/floors/{floor_code}/placement",
                    headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
                )
                floor_info = response_floor_info.json()
                floor_dict = {
                    "center": {
                        "latitude": floor_info["geoCenter"]["latitude"],
                        "longitude": floor_info["geoCenter"]["longitude"],
                    },
                    "scale": floor_info["scale"],
                    "angle": floor_info["angle"],
                    "pdfCenter": {
                        "x": floor_info["pdfCenter"]["x"],
                        "y": floor_info["pdfCenter"]["y"],
                    },
                }

                all_floors_data[building_code][floor_level] = floor_dict

    # Save file
    with open("cmumaps-data/floorplans/placements-serialized.json", "w") as f:
        json.dump(all_floors_data, f, indent=4)
    upload_json_file(
        local_file_path="cmumaps-data/floorplans/placements-serialized.json",
        s3_object_name="floorplans/placements-serialized.json",
    )
    return


if __name__ == "__main__":
    placements_serializer()

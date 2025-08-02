# Script to create a serialized version of placements.json from the database.
# python floorplans/serializer/placements.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.api_client import get_api_client

import json


def placements_serializer():
    """
    Fetches floor data from the server and saves it to the placements-serialized.json
    """
    all_floors_data = {}

    buildings = get_api_client(path="buildings")

    for building in buildings:
        if buildings[building]["floors"]:
            building_code = buildings[building]["code"]
            floor_levels = buildings[building]["floors"]
            all_floors_data[building_code] = {}

            for floor_level in floor_levels:
                floor_code = f"{building_code}-{floor_level}"
                floor_info = get_api_client(path=f"floors/{floor_code}/placement")
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

    return


if __name__ == "__main__":
    placements_serializer()

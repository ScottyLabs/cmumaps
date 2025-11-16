# Script to populate the Building table of the database using buildings.json
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import json
import requests  # type: ignore
from s3_utils.s3_utils import get_json_from_s3


# Drop Building table
def drop_building_table(clerk_manager):
    server_url = clerk_manager.server_url
    response = requests.delete(
        f"{server_url}/drop-tables",
        json={"tableNames": ["Building"]},
        headers={"Authorization": f"Bearer {clerk_manager.get_clerk_token()}"},
    )
    print(response.json())


# Populate Building table
def create_buildings(clerk_manager):
    data = get_json_from_s3("floorplans/buildings.json", return_data=True)

    # Iterate through all buildings
    buildings_data = []
    for buildingCode in data:
        name = data[buildingCode]["name"]
        osmId = data[buildingCode]["osmId"]
        if "defaultOrdinal" in data[buildingCode]:
            defaultOrdinal = data[buildingCode]["defaultOrdinal"]
        else:
            defaultOrdinal = None
        labelLatitude = data[buildingCode]["labelPosition"]["latitude"]
        labelLongitude = data[buildingCode]["labelPosition"]["longitude"]
        shape = json.dumps(data[buildingCode]["shapes"])
        hitbox = json.dumps(data[buildingCode]["hitbox"])
        # Create building entry
        building = {
            "buildingCode": buildingCode,
            "name": name,
            "osmId": osmId,
            "defaultOrdinal": defaultOrdinal,
            "labelLatitude": labelLatitude,
            "labelLongitude": labelLongitude,
            "shape": shape,
            "hitbox": hitbox,
        }
        buildings_data.append(building)

    # Send request to server to populate Building table
    server_url = clerk_manager.server_url
    response = requests.post(
        f"{server_url}/populate-table/buildings",
        json=buildings_data,
        headers={"Authorization": f"Bearer {clerk_manager.get_clerk_token()}"},
    )
    print(response)
    print(response.json())

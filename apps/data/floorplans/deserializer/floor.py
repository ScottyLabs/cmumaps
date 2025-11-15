# Script to populate the Floor table of the database using placements.json
# Precondition: Building table must be populated
# excludes outside

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import requests  # type: ignore
from auth_utils.get_clerk_token import get_clerk_token
from s3_utils.s3_utils import get_json_from_s3


def drop_floor_table():
    server_url = os.getenv("SERVER_URL")
    response = requests.delete(
        f"{server_url}/drop-tables",
        json={"tableNames": ["Floor"]},
        headers={"Authorization": f"Bearer {get_clerk_token()}"},
    )
    print(response.json())


def create_floors():
    floors_data = []

    # with open("cmumaps-data/floorplans/buildings.json", "r") as file:
    #     buildings = json.load(file)
    buildings = get_json_from_s3("floorplans/buildings.json", return_data=True)

    # with open("cmumaps-data/floorplans/placements.json", "r") as file:
    #     data = json.load(file)
    data = get_json_from_s3("floorplans/placements.json", return_data=True)

    for buildingCode in data:
        if buildingCode == "outside":
            continue

        for floorLevel in data[buildingCode]:
            centerLatitude = data[buildingCode][floorLevel]["center"]["latitude"]
            centerLongitude = data[buildingCode][floorLevel]["center"]["longitude"]
            scale = data[buildingCode][floorLevel]["scale"]
            angle = data[buildingCode][floorLevel]["angle"]
            pdf_center = data[buildingCode][floorLevel]["pdfCenter"]

            defaultFloor = buildings[buildingCode]["defaultFloor"]
            isDefault = floorLevel == defaultFloor

            floor = {
                "buildingCode": buildingCode,
                "floorLevel": floorLevel,
                "isDefault": isDefault,
                "centerX": pdf_center["x"],
                "centerY": pdf_center["y"],
                "centerLatitude": centerLatitude,
                "centerLongitude": centerLongitude,
                "scale": scale,
                "angle": angle,
            }

            floors_data.append(floor)

    # Send request to server to populate Floor table
    server_url = os.getenv("SERVER_URL")
    response = requests.post(
        f"{server_url}/populate-table/floors",
        json=floors_data,
        headers={"Authorization": f"Bearer {get_clerk_token()}"},
    )
    print(response)
    print(response.json())


if __name__ == "__main__":
    drop_floor_table()
    create_floors()

# Script to populate the Floor table of the database using placements.json
# Precondition: Building table must be populated
# excludes outside

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import json
import requests  # type: ignore
from auth_utils.get_clerk_jwt import get_clerk_jwt


def drop_floor_table():
    server_url = os.getenv("SERVER_URL")
    response = requests.delete(
        f"{server_url}/api/drop-tables",
        json={"tableNames": ["Floor"]},
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response.json())


def create_floors():
    floors_data = []

    with open("cmumaps-data/floorplans/buildings.json", "r") as file:
        buildings = json.load(file)

    with open("cmumaps-data/floorplans/placements.json", "r") as file:
        data = json.load(file)

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
        f"{server_url}/api/populate-table/floors",
        json=floors_data,
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response.json())


if __name__ == "__main__":
    drop_floor_table()
    create_floors()

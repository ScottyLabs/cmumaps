# Script to create a serialized version of floorplans.json from the database.
# python floorplans/serializer/floorplans.py
import os
import sys
import requests

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_token import get_clerk_token
from s3_utils.s3_utils import upload_json_file, get_json_from_s3

import json

from all_graph import pdf_coords_to_geo_coords

server_url = os.getenv("SERVER_URL")


def floorplans_serializer(floor_code: str = None):
    """
    Fetches floor data from the server and saves it to the floorplans_serialized.json
    Optionally, if a floor code in the format of 'GHC-3' is provided,
    updates that floor in floorplans.json directly.
    """

    # Update specific floor in floorplans_serializer.json
    if floor_code:
        building_code = floor_code.split("-")[0]
        floor_level = floor_code.split("-")[1]
        file_to_update = "cmumaps-data/floorplans/floorplans-serialized.json"

        response_rooms = requests.get(
            f"{server_url}/floors/{floor_code}/rooms",
            headers={"Authorization": f"Bearer {get_clerk_token()}"},
        )
        response_placement = requests.get(
            f"{server_url}/floors/{floor_code}/placement",
            headers={"Authorization": f"Bearer {get_clerk_token()}"},
        )

        rooms = response_rooms.json()
        placement = response_placement.json()

        # changed
        floorplans_data = get_json_from_s3(
            "floorplans/floorplans.json", return_data=True
        )
        for room in rooms:
            room_info = rooms[room]
            room_name = room_info["name"]
            roomId = room

            latitude, longitude = pdf_coords_to_geo_coords(
                pdf_coords=room_info["labelPosition"],
                geo_center=placement["geoCenter"],
                pdf_center=placement["pdfCenter"],
                scale=placement["scale"],
                angle_radians=placement["angle"],
            )
            # pdf coordinates to geo coordinates
            coordinates = []
            room_polygon = room_info["polygon"]
            for pair in room_polygon["coordinates"][0]:
                x, y = pair[0], pair[1]
                pdf_coords = {"x": x, "y": y}
                lat, long = pdf_coords_to_geo_coords(
                    pdf_coords=pdf_coords,
                    geo_center=placement["geoCenter"],
                    pdf_center=placement["pdfCenter"],
                    scale=placement["scale"],
                    angle_radians=placement["angle"],
                )
                coordinates.append({"latitude": lat, "longitude": long})

            new_room_dict = {
                "name": room_name,
                "labelPosition": {
                    "latitude": latitude,
                    "longitude": longitude,
                },
                "type": room_info["type"],
                "id": roomId,
                "floor": {"buildingCode": building_code, "level": floor_level},
                "coordinates": [coordinates],
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
        response_buildings = requests.get(
            f"{server_url}/buildings",
            headers={"Authorization": f"Bearer {get_clerk_token()}"},
        )
        buildings = response_buildings.json()
        all_floor_codes = []
        for building in buildings:
            floors = buildings[building]["floors"]
            for floor in floors:
                floor_code = f"{building}-{floor}"
                all_floor_codes.append(floor_code)

        for floor_code in all_floor_codes:
            building_code = floor_code.split("-")[0]
            floor_level = floor_code.split("-")[1]
            response_rooms = requests.get(
                f"{server_url}/floors/{floor_code}/rooms",
                headers={"Authorization": f"Bearer {get_clerk_token()}"},
            )
            response_placement = requests.get(
                f"{server_url}/floors/{floor_code}/placement",
                headers={"Authorization": f"Bearer {get_clerk_token()}"},
            )
            rooms = response_rooms.json()
            placement = response_placement.json()
            for room in rooms:
                room_info = rooms[room]
                room_name = room_info["name"]
                roomId = room

                latitude, longitude = pdf_coords_to_geo_coords(
                    pdf_coords=room_info["labelPosition"],
                    geo_center=placement["geoCenter"],
                    pdf_center=placement["pdfCenter"],
                    scale=placement["scale"],
                    angle_radians=placement["angle"],
                )

                coordinates = []
                room_polygon = room_info["polygon"]
                for pair in room_polygon["coordinates"][0]:
                    x, y = pair[0], pair[1]
                    pdf_coords = {"x": x, "y": y}
                    lat, long = pdf_coords_to_geo_coords(
                        pdf_coords=pdf_coords,
                        geo_center=placement["geoCenter"],
                        pdf_center=placement["pdfCenter"],
                        scale=placement["scale"],
                        angle_radians=placement["angle"],
                    )
                    coordinates.append({"latitude": lat, "longitude": long})

                new_room_dict = {
                    "name": room_name,
                    "labelPosition": {
                        "latitude": latitude,
                        "longitude": longitude,
                    },
                    "type": room_info["type"],
                    "id": roomId,
                    "floor": {"buildingCode": building_code, "level": floor_level},
                    "coordinates": [coordinates],
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
        upload_json_file(
            local_file_path="cmumaps-data/floorplans/floorplans-serialized.json",
            s3_object_name="floorplans/floorplans-serialized.json",
        )
    return


if __name__ == "__main__":
    floorplans_serializer(floor_code=None)

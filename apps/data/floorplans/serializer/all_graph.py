# Script to create a serialized version of all-graph.json from the database.
# python floorplans/serializer/all_graph.py
import os
import sys
import math
import requests

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_jwt import get_clerk_jwt
from s3_utils.s3_utils import upload_json_file

import json

server_url = os.getenv("SERVER_URL")


def pdf_coords_to_geo_coords(
    pdf_coords,
    geo_center,
    pdf_center,
    scale,
    angle_radians,
    longitude_ratio=84719.3945182816,
    latitude_ratio=111318.8450631976,
):
    x, y = pdf_coords["x"], pdf_coords["y"]
    cx, cy = pdf_center["x"], pdf_center["y"]
    lat0, lon0 = geo_center["latitude"], geo_center["longitude"]

    translated_x = x - cx
    translated_y = y - cy

    sin_a = math.sin(angle_radians)
    cos_a = math.cos(angle_radians)
    ry = translated_x * sin_a + translated_y * cos_a
    rx = translated_x * cos_a - translated_y * sin_a

    scaled_x = rx / scale
    scaled_y = ry / scale

    longitude = scaled_x / longitude_ratio + lon0
    latitude = scaled_y / latitude_ratio + lat0

    return (latitude, longitude)


def all_graph_serializer():
    """
    Fetches floor data from the server and saves it to the all-graph-serialized.json
    """
    response_buildings = requests.get(
        f"{server_url}/buildings",
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    buildings = response_buildings.json()

    all_floor_codes = []
    for building in buildings:
        floors = buildings[building]["floors"]
        for floor in floors:
            floor_code = f"{building}-{floor}"
            all_floor_codes.append(floor_code)

    all_nodes_data = {}
    for floor_code in all_floor_codes:
        building_code = floor_code.split("-")[0]
        floor_level = floor_code.split("-")[1]
        response_nodes = requests.get(
            f"{server_url}/floors/{floor_code}/graph",
            headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
        )
        nodes = response_nodes.json()
        response_placement = requests.get(
            f"{server_url}/floors/{floor_code}/placement",
            headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
        )
        placement = response_placement.json()

        for node in nodes:
            node_info = nodes[node]
            node_id = node
            node_dict = {}

            node_dict["id"] = node_id
            node_dict["pos"] = node_info["pos"]  # GeoCoordinate
            node_dict["roomId"] = node_info["roomId"]

            latitude, longitude = pdf_coords_to_geo_coords(
                pdf_coords=node_info["pos"],
                geo_center=placement["geoCenter"],
                pdf_center=placement["pdfCenter"],
                scale=placement["scale"],
                angle_radians=placement["angle"],
            )

            node_dict["coordinate"] = {
                "latitude": latitude,
                "longitude": longitude,
            }
            node_dict["floor"] = {
                "buildingCode": building_code,
                "level": floor_level,
            }
            neighbors = node_info["neighbors"]
            neighbors_dict = {}
            for neighbor in neighbors:
                neighbors_dict[neighbor] = {"dist": 0}
            node_dict["neighbors"] = neighbors_dict

            all_nodes_data[node] = node_dict

    # Save file
    with open("cmumaps-data/floorplans/all-graph-serialized.json", "w") as f:
        json.dump(all_nodes_data, f, indent=4)
    upload_json_file(
        local_file_path="cmumaps-data/floorplans/all-graph-serialized.json",
        s3_object_name="floorplans/all-graph-serialized.json",
    )

    return


if __name__ == "__main__":
    all_graph_serializer()

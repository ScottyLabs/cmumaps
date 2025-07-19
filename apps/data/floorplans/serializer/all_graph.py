# Script to create a serialized version of all-graph.json from the database.
# python floorplans/serializer/all_graph.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from auth_utils.get_clerk_jwt import get_clerk_jwt

import requests
import json


def all_graph_serializer():
    """
    Fetches floor data from the server and saves it to the all-graph-serialized.json
    """

    server_url = os.getenv("SERVER_URL")

    headers = {
        "Authorization": f"Bearer {get_clerk_jwt()}",
    }

    all_buildings = requests.get(f"{server_url}/api/buildings", headers=headers)
    all_buildings.raise_for_status()  # debugging
    buildings = all_buildings.json()
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
        nodes_response = requests.get(
            f"{server_url}/api/floors/{floor_code}/graph", headers=headers
        )
        nodes_response.raise_for_status()  # debugging
        nodes = nodes_response.json()

        for node in nodes:
            node_info = nodes[node]
            node_id = node
            node_dict = {}

            node_dict["id"] = node_id
            node_dict["pos"] = node_info["pos"]
            node_dict["roomId"] = node_info["roomId"]

            node_dict["coordinate"] = {
                "latitude": node_info["position"]["latitude"],
                "longitude": node_info["position"]["longitude"],
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

    return


if __name__ == "__main__":
    all_graph_serializer()

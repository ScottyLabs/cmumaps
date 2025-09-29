# Script to populate Node table of the database using all_graph.json
# skip outside nodes
# python scripts/json-to-database/node.py
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import requests  # type: ignore
from auth_utils.get_clerk_jwt import get_clerk_jwt
from s3_utils.s3_utils import get_json_from_s3


# Drop and populate Node table
def drop_node_table():
    server_url = os.getenv("SERVER_URL")
    response = requests.delete(
        f"{server_url}/drop-tables",
        json={"tableNames": ["Node"]},
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response.json())


def create_nodes():
    data = get_json_from_s3("floorplans/all-graph.json", return_data=True)

    node_data = []
    for nodeId in data:
        nodeDict = data[nodeId]
        latitude = nodeDict["coordinate"]["latitude"]
        longitude = nodeDict["coordinate"]["longitude"]
        buildingCode = nodeDict["floor"]["buildingCode"]
        floorLevel = nodeDict["floor"]["level"]
        roomId = nodeDict["roomId"] if buildingCode != "outside" else ""

        node = {
            "nodeId": nodeDict["id"],
            "latitude": latitude,
            "longitude": longitude,
            "buildingCode": buildingCode if buildingCode != "outside" else None,
            "floorLevel": floorLevel if buildingCode != "outside" else None,
            "roomId": roomId if roomId else None,
        }

        node_data.append(node)

    # Send request to server to populate Node table
    server_url = os.getenv("SERVER_URL")
    response = requests.post(
        f"{server_url}/populate-table/nodes",
        json=node_data,
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response)
    print(response.json())


if __name__ == "__main__":
    drop_node_table()
    create_nodes()

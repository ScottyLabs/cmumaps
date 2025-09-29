# Script to populate Edge table of the database using all_graph.json
# excludes outside, neighbors who are missing in node or out node,
# edges whose in node or out node are missing a roomId
# python scripts/json-to-database/edge.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import requests  # type: ignore
from auth_utils.get_clerk_jwt import get_clerk_jwt
from s3_utils.s3_utils import get_json_from_s3


# Drop and populate Edge table
def drop_edge_table():
    server_url = os.getenv("SERVER_URL")
    response = requests.delete(
        f"{server_url}/drop-tables",
        json={"tableNames": ["Edge"]},
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response.json())


def create_edges():
    data = get_json_from_s3("floorplans/all-graph.json", return_data=True)

    edge_data = []
    for nodeId in data:
        if "neighbors" not in data[nodeId]:
            print(f"Node {nodeId} has no neighbors")
            continue
        neighbors = data[nodeId]["neighbors"]
        for neighbor_id in neighbors:
            inNodeId = nodeId
            outNodeId = neighbor_id

            edge_node = {"inNodeId": inNodeId, "outNodeId": outNodeId}

            if outNodeId not in data:
                continue

            edge_data.append(edge_node)

    # Send request to server to populate Edge table
    server_url = os.getenv("SERVER_URL")
    response = requests.post(
        f"{server_url}/populate-table/edges",
        json=edge_data,
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response)
    print(response.json())


if __name__ == "__main__":
    drop_edge_table()
    create_edges()

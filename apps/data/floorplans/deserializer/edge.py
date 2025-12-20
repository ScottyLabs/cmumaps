# Script to populate Edge table of the database using all_graph.json
# excludes outside, neighbors who are missing in node or out node,
# edges whose in node or out node are missing a roomId
# python scripts/json-to-database/edge.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import requests  # type: ignore
from s3_utils.s3_utils import get_json_from_s3


# Drop and populate Edge table
def drop_edge_table(clerk_manager):
    server_url = clerk_manager.server_url
    response = requests.delete(
        f"{server_url}/drop-tables",
        json={"tableNames": ["Edge"]},
        headers={"Authorization": f"Bearer {clerk_manager.get_clerk_token()}"},
    )
    print(response.json())


def create_edges(clerk_manager):
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
    server_url = clerk_manager.server_url
    response = requests.post(
        f"{server_url}/populate-table/edges",
        json=edge_data,
        headers={"Authorization": f"Bearer {clerk_manager.get_clerk_token()}"},
    )
    print(response)
    print(response.json())

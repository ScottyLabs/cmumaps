# Script to populate Edge table of the database using all_graph.json
# excludes outside, neigbors who are missing in node or out node,
# edges whose in node or out node are missing a roomId
# python scripts/json-to-database/edge.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from prisma import Prisma  # type: ignore
import asyncio
import json
import requests  # type: ignore

from auth_utils.get_clerk_jwt import get_clerk_jwt

prisma = Prisma()


# Drop and populate Edge table
async def drop_edge_table():
    server_url = os.getenv("SERVER_URL")
    response = requests.post(
        f"{server_url}/api/drop-tables",
        json={"tableNames": ["Edge"]},
        headers={"Authorization": f"Bearer {get_clerk_jwt()}"},
    )
    print(response.json())


async def create_edges(target_building=None, target_floor=None):
    await prisma.connect()

    file_path = "cmumaps-data/floorplans/all-graph.json"
    with open(file_path, "r") as file:
        data = json.load(file)

    edge_data = []

    for nodeId in data:
        if "neighbors" not in data[nodeId]:
            continue

        if data[nodeId]["floor"]["buildingCode"] == "outside":
            continue

        neighbors = data[nodeId]["neighbors"]
        for neighbor_id in neighbors:
            inNodeId = nodeId
            outNodeId = neighbor_id

            edge_node = {"inNodeId": inNodeId, "outNodeId": outNodeId}

            if outNodeId not in data:
                continue

            # skip edges that are outside
            if "toFloorInfo" in neighbors[neighbor_id]:
                toFloorInfo = neighbors[neighbor_id]["toFloorInfo"]
                if toFloorInfo and toFloorInfo["toFloor"] == "outside 1":
                    continue

            edge_data.append(edge_node)

    # will get prisma.engine.errors.UnprocessableEntityError if not create in batches
    batch_size = 30000

    for i in range(0, len(edge_data), batch_size):
        batch = edge_data[i : i + batch_size]

        async with prisma.tx() as tx:
            await tx.edge.create_many(data=batch)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(drop_edge_table())
    # asyncio.run(create_edges())

# Script to populate Edge table of the database using all_graph.json
# excludes outside, neigbors who are missing in node or out node,
# edges whose in node or out node are missing a roomId
# python scripts/json-to-database/edge.py
from prisma import Prisma
import asyncio
import json

prisma = Prisma()


# Drop and populate Edge table
async def drop_edge_table():
    await prisma.connect()

    table_names = ["Edge"]

    for table_name in table_names:
        try:
            # Truncate each table
            await prisma.query_raw(
                f'TRUNCATE TABLE "{table_name}" RESTART IDENTITY CASCADE'
            )
            print(f"Cleared table: {table_name}")
        except Exception as e:
            print(f"Error clearing table {table_name}: {e}")

    await prisma.disconnect()


def get_outside_rooms():
    with open("json/outside-graph.json", "r") as file:
        outside_data = json.load(file)

    outside_rooms = [outsideId for outsideId in outside_data]
    return outside_rooms


async def create_edges(target_building=None, target_floor=None):
    await prisma.connect()

    file_path = "json/all_graph.json"
    with open(file_path, "r") as file:
        data = json.load(file)

    outside_rooms = get_outside_rooms()

    edge_data = []

    for nodeId in data:
        if "neighbors" not in data[nodeId]:
            continue

        edges = data[nodeId]["neighbors"]
        for edge in edges:
            inNodeId = nodeId
            outNodeId = edge

            edge_node = {"inNodeId": inNodeId, "outNodeId": outNodeId}

            if outNodeId not in data:
                continue
            if inNodeId in outside_rooms or outNodeId in outside_rooms:
                continue
            if not data[nodeId]["roomId"] or not data[outNodeId]["roomId"]:
                continue

            edge_data.append(edge_node)

    # if target_building and/or target_floor specified
    for node in edge_data:
        if target_building or target_floor:
            target_edges = []

            nodes = await prisma.query_raw(
                'SELECT "nodeId" FROM "Node" WHERE "buildingCode" = $1 AND "floorLevel" = $2;',
                target_building,
                target_floor,
            )
            target_nodes = [node["nodeId"] for node in nodes]  # Extract nodeId values
            if node["inNodeId"] in target_nodes or node["outNodeId"] in target_nodes:
                target_edges.append(node)

            edge_data = target_edges

    # sometimes will get prisma.engine.errors.UnprocessableEntityError if not populate in batches
    batch_size = 30000

    for i in range(0, len(edge_data), batch_size):
        batch = edge_data[i : i + batch_size]  # Get current batch

        async with prisma.tx() as tx:
            await tx.edge.create_many(data=batch)

    # async with prisma.tx() as tx:
    #     await tx.edge.create_many(data=edge_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(drop_edge_table())
    asyncio.run(create_edges())

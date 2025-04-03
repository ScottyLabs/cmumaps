# Script to populate Node table of the database using all_graph.json
# skip outside nodes
# python scripts/json-to-database/node.py
from prisma import Prisma  # type: ignore
import asyncio
import json

prisma = Prisma()


# Drop and populate Node table
async def drop_node_table():
    await prisma.connect()

    table_names = ["Node"]

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
    with open("cmumaps-datamaps-data/floorplans/outside-graph.json", "r") as file:
        outside_data = json.load(file)

    outside_rooms = [outsideId for outsideId in outside_data]
    return outside_rooms


async def create_nodes(target_building=None, target_floor=None):
    await prisma.connect()

    file_path = "cmumaps-data/floorplans/all_graph.json"
    with open(file_path, "r") as file:
        data = json.load(file)

    outside_rooms = get_outside_rooms()

    node_data = []
    for nodeId in data:
        nodeDict = data[nodeId]
        latitude = nodeDict["coordinate"]["latitude"]
        longitude = nodeDict["coordinate"]["longitude"]
        roomId = nodeDict["roomId"]
        buildingCode = nodeDict["floor"]["buildingCode"]
        floorLevel = nodeDict["floor"]["level"]

        node = {
            "nodeId": nodeDict["id"],
            "latitude": latitude,
            "longitude": longitude,
            "buildingCode": buildingCode,
            "floorLevel": floorLevel,
        }
        if node["nodeId"] in outside_rooms:
            continue

        if roomId:
            node["roomId"] = roomId

        node_data.append(node)

    # if target_building and/or target_floor specified
    for node in node_data:
        if target_building or target_floor:
            target_nodes = []

            if (
                node["buildingCode"] == target_building
                and node["floorLevel"] == target_floor
            ):
                target_nodes.append(node)

            node_data = target_nodes

    async with prisma.tx() as tx:
        await tx.node.create_many(data=node_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(drop_node_table())
    asyncio.run(create_nodes())

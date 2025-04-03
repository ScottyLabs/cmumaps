# Script to populate the Floor table of the database using placements.json
# Precondition: Building table must be populated
# excludes outside
from prisma import Prisma  # type: ignore
import asyncio
import json

prisma = Prisma()


async def drop_floor_tables():
    await prisma.connect()

    table_names = ["Floor"]

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


async def create_floor(target_building=None, target_floor=None):
    await prisma.connect()

    floors_data = []

    with open("cmumaps-data/floorplans/buildings.json", "r") as file:
        buildings = json.load(file)

    with open("cmumaps-data/floorplans/placements.json", "r") as file:
        data = json.load(file)

    with open("cmumaps-data/floorplans/floorCenters.json", "r") as file:
        floor_centers = json.load(file)

    for buildingCode in data:
        if buildingCode == "outside":
            continue

        for floorLevel in data[buildingCode]:
            centerLatitude = data[buildingCode][floorLevel]["center"]["latitude"]
            centerLongitude = data[buildingCode][floorLevel]["center"]["longitude"]
            scale = data[buildingCode][floorLevel]["scale"]
            angle = data[buildingCode][floorLevel]["angle"]
            center = floor_centers[buildingCode][floorLevel]

            defaultFloor = buildings[buildingCode]["defaultFloor"]
            isDefault = floorLevel == defaultFloor

            floor = {
                "buildingCode": buildingCode,
                "floorLevel": floorLevel,
                "isDefault": isDefault,
                "centerX": center[0],
                "centerY": center[1],
                "centerLatitude": centerLatitude,
                "centerLongitude": centerLongitude,
                "scale": scale,
                "angle": angle,
            }

            floors_data.append(floor)

    # if target_building and/or target_floor specified
    for node in floors_data:
        if target_building or target_floor:
            target_nodes = []

            if (
                node["buildingCode"] == target_building
                and node["floorLevel"] == target_floor
            ):
                target_nodes.append(node)

            floors_data = target_nodes

    async with prisma.tx() as tx:
        await tx.floor.create_many(data=floors_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(drop_floor_tables())
    asyncio.run(create_floor())

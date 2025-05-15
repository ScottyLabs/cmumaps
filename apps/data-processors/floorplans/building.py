# Script to populate the Building table of the database using buildings.json
from prisma import Prisma  # type: ignore
import asyncio
import json

prisma = Prisma()


# Drop Building table
async def drop_buildings_tables():
    await prisma.connect()

    table_names = ["Building"]

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


# Populate Building table
async def create_building():
    await prisma.connect()

    buildings_data = []

    with open("cmumaps-data/floorplans/buildings.json", "r") as file:
        data = json.load(file)
    # Iterate through all buildings
    for buildingCode in data:
        name = data[buildingCode]["name"]
        osmId = data[buildingCode]["osmId"]
        if "defaultOrdinal" in data[buildingCode]:
            defaultOrdinal = data[buildingCode]["defaultOrdinal"]
        else:
            defaultOrdinal = None
        labelLatitude = data[buildingCode]["labelPosition"]["latitude"]
        labelLongitude = data[buildingCode]["labelPosition"]["longitude"]
        shape = json.dumps(data[buildingCode]["shapes"])
        hitbox = json.dumps(data[buildingCode]["hitbox"])
        # Create building entry
        building = {
            "buildingCode": buildingCode,
            "name": name,
            "osmId": osmId,
            "defaultOrdinal": defaultOrdinal,
            "labelLatitude": labelLatitude,
            "labelLongitude": labelLongitude,
            "shape": shape,
            "hitbox": hitbox,
        }
        buildings_data.append(building)
    # Create all building entries
    async with prisma.tx() as tx:
        await tx.building.create_many(data=buildings_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(drop_buildings_tables())
    asyncio.run(create_building())

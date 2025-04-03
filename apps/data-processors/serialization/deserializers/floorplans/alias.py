# create Alias table of the database using floorPlanMap.json
from prisma import Prisma  # type: ignore
import asyncio
import json

prisma = Prisma()


# Drop and populate Alias table
async def drop_alias_table():
    await prisma.connect()

    table_names = ["Alias"]

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


if __name__ == "__main__":
    asyncio.run(drop_alias_table())


async def create_alias(target_building=None, target_floor=None):
    await prisma.connect()

    file_path = "cmumaps-data/floorplans/searchMap.json"
    with open(file_path, "r") as file:
        data = json.load(file)

    for building in data:
        # skip empty buildings
        if not data[building]:
            continue

        # skip outside because we will be using OSM
        if building == "outside":
            continue

        alias_data = []
        for floor in data[building]:
            for room in data[building][floor]:
                displayAlias = room["alias"]
                roomId = room["id"]
                for alias in room["aliases"]:
                    if alias:
                        alias_data.append(
                            {
                                "alias": alias,
                                "roomId": roomId,
                                "isDisplayAlias": alias == displayAlias,
                            }
                        )

        # if target_building and/or target_floor specified
        for node in alias_data:
            if target_building or target_floor:
                target_alias = []

                nodes = await prisma.query_raw(
                    'SELECT "roomId" FROM "Room" WHERE "buildingCode" = $1 AND "floorLevel" = $2;',
                    target_building,
                    target_floor,
                )
                target_nodes = [
                    room["roomId"] for room in nodes
                ]  # Extract nodeId values
                if node["roomId"] in target_nodes:
                    target_alias.append(node)

                alias_data = target_alias

        async with prisma.tx() as tx:
            await tx.alias.create_many(data=alias_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(create_alias())

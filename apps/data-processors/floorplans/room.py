# Script to populate the Rooms table
# skip empty buildings and outside
from prisma import Prisma  # type: ignore
import asyncio
import json

prisma = Prisma()


# Drop and populate Element and Room tables
async def drop_room_tables():
    await prisma.connect()

    table_names = ["Room"]

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
    asyncio.run(drop_room_tables())


async def create_rooms(target_building=None, target_floor=None):
    await prisma.connect()

    file_path = "cmumaps-data/floorplans/floorPlans.json"
    with open(file_path, "r") as file:
        data = json.load(file)

    for building in data:
        # skip empty buildings
        if not data[building]:
            continue

        # skip outside because we will be using OSM
        if building == "outside":
            continue

        rooms_data = []

        for floor in data[building]:
            for room in data[building][floor]:
                roomdata = data[building][floor][room]
                roomId = roomdata["id"]
                labelLatitude = roomdata["labelPosition"]["latitude"]
                labelLongitude = roomdata["labelPosition"]["longitude"]
                type = roomdata["type"]
                buildingCode = roomdata["floor"]["buildingCode"]
                floorLevel = roomdata["floor"]["level"]
                name = roomdata["name"]
                polygon = json.dumps(roomdata["coordinates"])

                room = {
                    "roomId": roomId,
                    "name": name,
                    "type": type,
                    "labelLatitude": labelLatitude,
                    "labelLongitude": labelLongitude,
                    "polygon": polygon,
                    "buildingCode": buildingCode,
                    "floorLevel": floorLevel,
                }

                rooms_data.append(room)

        # if target_building and/or target_floor specified
        for node in rooms_data:
            if target_building or target_floor:
                target_nodes = []

                if (
                    node["buildingCode"] == target_building
                    and node["floorLevel"] == target_floor
                ):
                    target_nodes.append(node)

                rooms_data = target_nodes

        async with prisma.tx() as tx:
            await tx.room.create_many(data=rooms_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(create_rooms())

# Script that resets (drops) every model of one floor and repopulates it
# python scripts/json-to-database/reset_floor.py <buildingCode> <floorLevel>
from prisma import Prisma
import asyncio
import sys
from edge import create_edges
from floor import create_floor
from room import create_rooms
from alias import create_alias
from node import create_nodes

prisma = Prisma()


async def drop_floor(building: str, floor: str):
    await prisma.connect()

    try:
        await prisma.execute_raw(
            'DELETE FROM "Edge" WHERE "inNodeId" IN (SELECT "nodeId" FROM "Node" WHERE "buildingCode" = $1 AND "floorLevel" = $2);',
            building,
            floor,
        )
        await prisma.execute_raw(
            'DELETE FROM "Edge" WHERE "outNodeId" IN (SELECT "nodeId" FROM "Node" WHERE "buildingCode" = $1 AND "floorLevel" = $2);',
            building,
            floor,
        )

        await prisma.execute_raw(
            'DELETE FROM "Poi" WHERE "nodeId" IN (SELECT "nodeId" FROM "Node" WHERE "buildingCode" = $1 AND "floorLevel" = $2);',
            building,
            floor,
        )
        await prisma.execute_raw(
            'DELETE FROM "Node" WHERE "buildingCode" = $1 AND "floorLevel" = $2;',
            building,
            floor,
        )

        await prisma.execute_raw(
            'DELETE FROM "Alias" WHERE "roomId" IN (SELECT "roomId" FROM "Room" WHERE "buildingCode" = $1 AND "floorLevel" = $2);',
            building,
            floor,
        )
        await prisma.execute_raw(
            'DELETE FROM "Room" WHERE "buildingCode" = $1 AND "floorLevel" = $2;',
            building,
            floor,
        )

        await prisma.execute_raw(
            'DELETE FROM "Floor" WHERE "buildingCode" = $1 AND "floorLevel" = $2;',
            building,
            floor,
        )

    except Exception as e:
        print(f"Error deleting floor: {e}")

    await prisma.disconnect()


async def repopulate_floor(building: str, floor: str):
    asyncio.run(create_floor(target_building=building, target_floor=floor))
    asyncio.run(create_rooms(target_building=building, target_floor=floor))
    asyncio.run(create_alias(target_building=building, target_floor=floor))
    asyncio.run(create_nodes(target_building=building, target_floor=floor))
    asyncio.run(create_edges(target_building=building, target_floor=floor))


if __name__ == "__main__":
    args = sys.argv
    buildingCode = args[1]
    floorLevel = args[2]
    asyncio.run(drop_floor(buildingCode, floorLevel))
    asyncio.run(repopulate_floor(buildingCode, floorLevel))

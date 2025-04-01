# Script that combines other json-to-database scripts to populate entire database
# python scripts/json-to-database/database-population.py
from prisma import Prisma
import asyncio
from building import create_building
from floor import create_floor
from room import create_rooms
from alias import create_alias
from node import create_nodes
from edge import create_edges

prisma = Prisma()

# Drop all tables


async def drop_all_tables():
    await prisma.connect()

    # Get list of tables in the 'public' schema
    table_names = ["Building", "Floor", "Room", "Alias", "Node", "Edge", "Poi"]

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
    asyncio.run(drop_all_tables())

    # Populate all tables
    asyncio.run(create_building())
    print("created buildings")
    asyncio.run(create_floor())
    print("created floors")
    asyncio.run(create_rooms())
    print("created rooms")
    asyncio.run(create_alias())
    print("created aliases")
    asyncio.run(create_nodes())
    print("created nodes")
    asyncio.run(create_edges())
    print("created edges")

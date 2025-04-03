# Script to populate Track table using data from the file cmumaps-data/spring-carnival/carnival_events.json
# Run this script first before events.py!
# python scripts/json-to-database-carnival/tracks.py

from prisma import Prisma  # type: ignore
import asyncio
import json

prisma = Prisma()


async def drop_specified_tables(table_names):
    await prisma.connect()

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


async def create_tracks():
    await prisma.connect()

    tracks_set = set()

    with open("cmumaps-data/spring-carnival/carnival_events.json", "r") as file:
        data = json.load(file)

    # Iterate through all events to put tracks in a set
    for event in data:
        tracks = data[event]["tracks"]
        for track in tracks:
            tracks_set.add(track)

    tracks_data = [{"trackName": track} for track in tracks_set]

    # Create all Tracks
    async with prisma.tx() as tx:
        await tx.tracks.create_many(data=tracks_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(drop_specified_tables(["Tracks"]))
    asyncio.run(create_tracks())
    print("Created table: Tracks")

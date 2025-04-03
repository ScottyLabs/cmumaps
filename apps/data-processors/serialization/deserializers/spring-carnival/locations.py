# Script to populate Location table using data from the file carnival_events.json
# python scripts/json-to-database-carnival/locations.py

from prisma import Prisma
import asyncio
import json
from tracks import drop_specified_tables

prisma = Prisma()


async def create_locations():
    await prisma.connect()

    location_set = set()

    with open("carnival_events.json", "r") as file:
        data = json.load(file)

    location_data = []
    for event in data:
        locationId = data[event]["locationId"]
        locationName = data[event]["locationName"]
        latitude = data[event]["latitude"]
        longitude = data[event]["longitude"]

        # Create Event Occurence entry
        location = {
            "locationId": locationId,
            "locationName": locationName,
        }
        if latitude != "" and longitude != "":
            location["latitude"] = latitude
            location["longitude"] = longitude

        if locationId not in location_set:
            location_data.append(location)
            location_set.add(locationId)

    # Create all Location entries
    async with prisma.tx() as tx:
        await tx.locations.create_many(data=location_data)
    await prisma.disconnect()


if __name__ == "__main__":
    # Drop Location table
    asyncio.run(drop_specified_tables(["Locations"]))
    asyncio.run(create_locations())
    print("Created table: Locations")

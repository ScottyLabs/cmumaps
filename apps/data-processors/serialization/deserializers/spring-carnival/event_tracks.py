# Script to populate EventTracks table using data from the file carnival_events.json
# python scripts/json-to-database-carnival/event_tracks.py

from prisma import Prisma  # type: ignore
import asyncio
import json
from tracks import drop_specified_tables

prisma = Prisma()


async def create_event_tracks():
    await prisma.connect()

    eventTracks_data = []
    eventId_set = set()

    with open("json/spring-carnival/carnival_events.json", "r") as file:
        data = json.load(file)
    # Iterate through all events
    for event in data:
        eventId = data[event]["eventId"]
        tracks = data[event]["tracks"]
        for track in tracks:
            # Create EventTrack entry
            eventTrack = {
                "eventId": eventId,
                "trackName": track,
            }
            if eventId not in eventId_set:
                eventTracks_data.append(eventTrack)
                eventId_set.add(eventId)

    # Create all Events entries
    async with prisma.tx() as tx:
        await tx.eventtrack.create_many(data=eventTracks_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(drop_specified_tables(["EventTracks"]))
    asyncio.run(create_event_tracks())
    print("Created table: EventTracks")

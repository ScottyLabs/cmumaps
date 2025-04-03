# Script to populate Event table using data from the file cmumaps-data/spring-carnival/carnival_events.json
# python scripts/json-to-database-carnival/events.py

from prisma import Prisma  # type: ignore
import asyncio
import json
from tracks import drop_specified_tables

prisma = Prisma()


def get_tags(tracks):
    tags = set()
    for track in tracks:
        # self-mapping tracks
        if track in [
            "CMU Tradition",
            "Food",
            "Awards/Celebration",
            "Exhibit/Tour",
            "Health/Wellness",
            "Alumni",
        ]:
            tags.add(track)
        # track maps to a different tag
        elif track == "Reunion":
            tags.add("Alumni")
        elif track == "Buggy":
            tags.add("CMU Tradition")
        elif track == "Scotch'n'Soda" or track == "Entertainment":
            tags.add("Performance")
        elif track == "Libraries" or track == "Open House/Reception":
            tags.add("Exhibit/Tour")
        elif track == "Athletics":
            tags.add("Health/Wellness")
    return list(tags)


async def create_events():
    await prisma.connect()

    events_data = []
    eventId_set = set()

    with open("cmumaps-data/spring-carnival/carnival_events.json", "r") as file:
        data = json.load(file)
    # Iterate through all events
    for event in data:
        eventId = data[event]["eventId"]
        title = data[event]["title"]
        description = data[event]["description"]
        req = data[event]["req"]
        tracks = data[event]["tracks"]

        # Create Event entry
        event = {
            "eventId": eventId,
            "title": title,
            "description": description,
            "tags": get_tags(tracks),
        }
        if req != "none":
            event["req"] = req

        if eventId not in eventId_set:
            events_data.append(event)
            eventId_set.add(eventId)

    # Create all Events entries
    async with prisma.tx() as tx:
        await tx.event.create_many(data=events_data)

    await prisma.disconnect()


if __name__ == "__main__":
    # Drop Event table
    asyncio.run(drop_specified_tables(["Event"]))
    asyncio.run(create_events())
    print("Created table: Event")

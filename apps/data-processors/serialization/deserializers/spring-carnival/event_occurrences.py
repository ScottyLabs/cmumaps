# Script to populate EventOccurrence table using data from the file carnival_events.json
# python scripts/json-to-database-carnival/event_occurrences.py

from prisma import Prisma  # type: ignore
import asyncio
import json
from tracks import drop_specified_tables

prisma = Prisma()


async def create_event_occurrences():
    await prisma.connect()

    event_occurrences_data = []

    with open("json/spring-carnival/carnival_events.json", "r") as file:
        data = json.load(file)
    # Iterate through all events
    for event in data:
        eventOccurrenceId = data[event]["eventOccurrenceId"]
        startTime = data[event]["startDateTime"]
        endTime = data[event]["endDateTime"]
        locationId = data[event]["locationId"]
        eventId = data[event]["eventId"]

        # Create Event Occurence entry
        event = {
            "eventOccurrenceId": eventOccurrenceId,
            "startTime": startTime,
            "endTime": endTime,
            "eventId": eventId,
            "locationId": locationId,
        }
        event_occurrences_data.append(event)
    # Create all Events entries
    async with prisma.tx() as tx:
        await tx.eventoccurrence.create_many(data=event_occurrences_data)

    await prisma.disconnect()


if __name__ == "__main__":
    # Drop Event table
    asyncio.run(drop_specified_tables(["EventOccurrences"]))
    asyncio.run(create_event_occurrences())
    print("Created table: EventOccurrences")

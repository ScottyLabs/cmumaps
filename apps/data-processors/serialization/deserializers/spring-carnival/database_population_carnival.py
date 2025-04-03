# Script to populate all carnival tables using data from the file carnival_events.json
# python scripts/json-to-database-carnival/database_population_carnival.py

from prisma import Prisma
import asyncio
from tracks import drop_specified_tables, create_tracks
from event_tracks import create_event_tracks
from events import create_events
from locations import create_locations
from event_occurrences import create_event_occurrences
from events_cleaning import extract_event_descriptions

prisma = Prisma()

if __name__ == "__main__":
    asyncio.run(
        drop_specified_tables(["Tracks", "EventTracks", "Events", "Locations", "EventOccurrences"])
    )

    asyncio.run(create_tracks())
    print("Created table: Tracks")
    asyncio.run(create_events())
    print("Created table: Events")
    asyncio.run(create_event_tracks())
    print("Created table: Event Tracks")
    asyncio.run(create_locations())
    print("Created table: Locations")
    asyncio.run(create_event_occurrences())
    print("Created table: EventOccurrences")
    
    
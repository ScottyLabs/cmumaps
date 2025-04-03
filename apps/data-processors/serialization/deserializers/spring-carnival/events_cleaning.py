# Script to extract descriptions for Events table
# python scripts/json-to-database-carnival/events_cleaning.py

from bs4 import BeautifulSoup
from prisma import Prisma
import asyncio


def extract_description(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    text = soup.get_text(separator=" ", strip=True)
    # remove 'Note:' and everything that comes after it
    if "Note:" in text:
        text = text.split("Note:")[0].strip()
    text = text.replace(" .", ".")
    return text


prisma = Prisma()


async def extract_event_descriptions():
    await prisma.connect()

    results = await prisma.query_raw('SELECT "eventId", "description" FROM "Events";')

    for result in results:
        original_description = result["description"]
        eventId = result["eventId"]

        extracted_description = extract_description(original_description)
        print(extracted_description)

        # Update the description using eventId as the identifier
        await prisma.events.update(
            where={"eventId": eventId}, data={"description": extracted_description}
        )
    print("Edited descriptions for Events table!")
    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(extract_event_descriptions())
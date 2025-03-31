import { EventType } from "@cmumaps/common";
import { prisma } from "..";

export const eventService = {
  // get next 10 numbers
  async getEvents(timestamp: number, limit: number): Promise<EventType[]> {
    /// return the next 10 events after the timestamp in order
    const dbEvents = await prisma.eventOccurrences.findMany({
      where: {
        startTime: {
          gt: new Date(timestamp),
        },
      },
      include: {
        Events: true,
        Locations: true,
      },
      orderBy: {
        startTime: "asc",
      },
      take: limit,
    });

    return dbEvents.map((dbEvent) => ({
      eventId: dbEvent.eventId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
    }));
  },
};

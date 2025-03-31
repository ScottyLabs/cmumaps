import { EventType } from "@cmumaps/common";
import { prisma } from "..";
interface EventResponse {
  events: EventType[];
  nextEventId?: string;
  nextTimestamp?: number;
  prevEventId?: string;
  prevTimestamp?: number;
}

export const eventService = {
  async getEventsByTimestamp(
    timestamp: number,
    limit: number,
  ): Promise<EventResponse> {
    const dbEvents = await prisma.eventOccurrences.findMany({
      where: { endTime: { gte: new Date(timestamp) } },
      include: { Events: true, Locations: true },
      orderBy: [
        { startTime: "asc" },
        { endTime: "asc" },
        { eventOccurrenceId: "asc" },
      ],
      take: limit,
    });

    const prevEventId = dbEvents[0]?.eventOccurrenceId;
    const nextEventId = dbEvents[limit - 1]?.eventOccurrenceId;
    const prevTimestamp = dbEvents[0]?.startTime.getTime();
    const nextTimestamp = dbEvents[limit - 1]?.endTime.getTime();
    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
    }));

    return { events, nextEventId, prevEventId, nextTimestamp, prevTimestamp };
  },

  async getEventsAfter(
    curId: string,
    curTimestamp: number,
    limit: number,
  ): Promise<EventResponse> {
    const dbEvents = await prisma.eventOccurrences.findMany({
      where: {
        startTime: { gt: new Date(curTimestamp) },
        eventOccurrenceId: { gt: curId },
      },
      include: { Events: true, Locations: true },
      orderBy: [
        { startTime: "asc" },
        { endTime: "asc" },
        { eventOccurrenceId: "asc" },
      ],
      take: limit,
    });

    const prevEventId = dbEvents[0]?.eventOccurrenceId;
    const nextEventId = dbEvents[limit - 1]?.eventOccurrenceId;
    const prevTimestamp = dbEvents[0]?.startTime.getTime();
    const nextTimestamp = dbEvents[limit - 1]?.endTime.getTime();
    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
    }));

    return { events, nextEventId, prevEventId, nextTimestamp, prevTimestamp };
  },

  async getEventsBefore(
    curId: string,
    curTimestamp: number,
    limit: number,
  ): Promise<EventResponse> {
    const dbEvents = await prisma.eventOccurrences.findMany({
      where: {
        endTime: { lt: new Date(curTimestamp) },
        eventOccurrenceId: { lt: curId },
      },
      include: { Events: true, Locations: true },
      orderBy: [
        { startTime: "desc" },
        { endTime: "desc" },
        { eventOccurrenceId: "desc" },
      ],
      take: limit,
    });

    const prevEventId = dbEvents[limit - 1]?.eventOccurrenceId;
    const nextEventId = dbEvents[0]?.eventOccurrenceId;
    const prevTimestamp = dbEvents[limit - 1]?.startTime.getTime();
    const nextTimestamp = dbEvents[0]?.endTime.getTime();
    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
    }));

    return { events, prevEventId, nextEventId, nextTimestamp, prevTimestamp };
  },
};

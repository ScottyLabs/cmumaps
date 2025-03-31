import { EventType } from "@cmumaps/common";
import { prisma } from "..";

interface EventResponse {
  events: EventType[];
  nextEventId?: string;
  prevEventId?: string;
}

export const eventService = {
  async getEventsByTimestamp(
    timestamp: number,
    limit: number,
  ): Promise<EventResponse> {
    const dbEvents = await prisma.eventOccurrences.findMany({
      where: { endTime: { gte: new Date(timestamp) } },
      include: { Events: true, Locations: true },
      orderBy: { endTime: "asc", eventId: "asc" },
      take: limit + 1,
    });

    const events = dbEvents.map((dbEvent) => ({
      eventId: dbEvent.eventId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
    }));

    const nextEventId = dbEvents[limit].eventId;

    const prevEvent = await prisma.eventOccurrences.findFirst({
      where: { endTime: { lt: new Date(timestamp) } },
      orderBy: { endTime: "asc", eventId: "asc" },
    });

    return { events, nextEventId, prevEventId: prevEvent?.eventId };
  },

  async getEventsAfter(eventId: string, limit: number): Promise<EventResponse> {
    const dbEvents = await prisma.eventOccurrences.findMany({
      where: { eventId: { gt: eventId } },
      include: { Events: true, Locations: true },
      orderBy: { endTime: "asc", eventId: "asc" },
      take: limit + 1,
    });

    const events = dbEvents.map((dbEvent) => ({
      eventId: dbEvent.eventId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
    }));

    const nextEventId = dbEvents[limit].eventId;

    const prevEvent = await prisma.eventOccurrences.findFirst({
      where: { eventId: { lt: eventId } },
      orderBy: { endTime: "asc", eventId: "asc" },
    });

    return { events, nextEventId, prevEventId: prevEvent?.eventId };
  },

  async getEventsBefore(
    eventId: string,
    limit: number,
  ): Promise<EventResponse> {
    const dbEvents = await prisma.eventOccurrences.findMany({
      where: { eventId: { lt: eventId } },
      include: { Events: true, Locations: true },
      orderBy: { endTime: "desc", eventId: "desc" },
      take: limit + 1,
    });

    const events = dbEvents.map((dbEvent) => ({
      eventId: dbEvent.eventId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
    }));

    const prevEventId = dbEvents[limit].eventId;

    const nextEvent = await prisma.eventOccurrences.findFirst({
      where: { eventId: { gt: eventId } },
      orderBy: { endTime: "asc", eventId: "asc" },
    });

    return { events, prevEventId, nextEventId: nextEvent?.eventId };
  },
};

import { EventResponse, EventsResponse } from "@cmumaps/common";
import { prisma } from "@cmumaps/db";

export const eventService = {
  async getEventById(eventId: string): Promise<EventResponse> {
    const dbEvent = await prisma.eventOccurrence.findUnique({
      where: { eventOccurrenceId: eventId },
      include: { event: true, location: true },
    });

    if (!dbEvent) {
      throw new Error("Event not found");
    }

    const event = {
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.event.title,
      description: dbEvent.event.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.location.locationName,
      latitude: dbEvent.location.latitude,
      longitude: dbEvent.location.longitude,
    };

    return { event };
  },

  async getEventsByTimestamp(
    timestamp: number,
    limit: number,
    filters: string[],
    reqs: string[],
  ): Promise<EventsResponse> {
    const dbEvents = await prisma.eventOccurrence.findMany({
      where: {
        endTime: { gte: new Date(timestamp) },
        event: {
          OR: [{ req: { in: reqs } }, { req: null }],
          eventTracks: { some: { track: { trackName: { in: filters } } } },
        },
      },
      include: { event: true, location: true },
      orderBy: [
        { startTime: "asc" },
        { endTime: "asc" },
        { eventOccurrenceId: "asc" },
      ],
      take: limit,
    });

    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.event.title,
      description: dbEvent.event.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.location.locationName,
      req: dbEvent.event.req,
    }));
    const prevEvent = events[0];
    const nextEvent = events[limit - 1];
    return { events, nextEvent, prevEvent };
  },

  async getEventsAfter(
    curId: string,
    curStartTime: number,
    curEndTime: number,
    limit: number,
    filters: string[],
    reqs: string[],
  ): Promise<EventsResponse> {
    const dbEvents = await prisma.eventOccurrence.findMany({
      where: {
        event: {
          OR: [{ req: { in: reqs } }, { req: null }],
          eventTracks: { some: { track: { trackName: { in: filters } } } },
        },
        OR: [
          { startTime: { gt: new Date(curStartTime) } },
          {
            AND: [
              { startTime: { equals: new Date(curStartTime) } },
              {
                OR: [
                  { endTime: { gt: new Date(curEndTime) } },
                  {
                    AND: [
                      { endTime: { equals: new Date(curEndTime) } },
                      { eventOccurrenceId: { gt: curId } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      include: { event: true, location: true },
      orderBy: [
        { startTime: "asc" },
        { endTime: "asc" },
        { eventOccurrenceId: "asc" },
      ],
      take: limit,
    });

    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.event.title,
      description: dbEvent.event.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.location.locationName,
    }));
    const prevEvent = events[0];
    const nextEvent = events[limit - 1];
    return { events, nextEvent, prevEvent };
  },

  async getEventsBefore(
    curId: string,
    curStartTime: number,
    curEndTime: number,
    limit: number,
    filters: string[],
    reqs: string[],
  ): Promise<EventsResponse> {
    const dbEvents = await prisma.eventOccurrence.findMany({
      where: {
        event: {
          OR: [{ req: { in: reqs } }, { req: null }],
          eventTracks: { some: { track: { trackName: { in: filters } } } },
        },
        OR: [
          { startTime: { lt: new Date(curStartTime) } },
          {
            AND: [
              { startTime: { equals: new Date(curStartTime) } },
              {
                OR: [
                  { endTime: { lt: new Date(curEndTime) } },
                  {
                    AND: [
                      { endTime: { equals: new Date(curEndTime) } },
                      { eventOccurrenceId: { lt: curId } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      include: { event: true, location: true },
      orderBy: [
        { startTime: "desc" },
        { endTime: "desc" },
        { eventOccurrenceId: "desc" },
      ],
      take: limit,
    });

    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.event.title,
      description: dbEvent.event.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.location.locationName,
    }));
    const prevEvent = events[limit - 1];
    const nextEvent = events[0];
    return { events, prevEvent, nextEvent };
  },
};

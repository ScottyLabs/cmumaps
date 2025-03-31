import { EventResponse } from "@cmumaps/common";
import { prisma } from "..";

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

    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
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
  ): Promise<EventResponse> {
    const dbEvents = await prisma.eventOccurrences.findMany({
      where: {
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
      include: { Events: true, Locations: true },
      orderBy: [
        { startTime: "asc" },
        { endTime: "asc" },
        { eventOccurrenceId: "asc" },
      ],
      take: limit,
    });

    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
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
  ): Promise<EventResponse> {
    const dbEvents = await prisma.eventOccurrences.findMany({
      where: {
        OR: [
          { endTime: { lt: new Date(curEndTime) } },
          {
            AND: [
              { endTime: { equals: new Date(curEndTime) } },
              {
                OR: [
                  { startTime: { lt: new Date(curStartTime) } },
                  {
                    AND: [
                      { startTime: { equals: new Date(curStartTime) } },
                      { eventOccurrenceId: { lt: curId } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      include: { Events: true, Locations: true },
      orderBy: [
        { startTime: "desc" },
        { endTime: "desc" },
        { eventOccurrenceId: "desc" },
      ],
      take: limit,
    });

    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      name: dbEvent.Events.title,
      description: dbEvent.Events.description,
      startTime: dbEvent.startTime,
      endTime: dbEvent.endTime,
      location: dbEvent.Locations.locationName,
    }));
    const prevEvent = events[limit - 1];
    const nextEvent = events[0];
    return { events, prevEvent, nextEvent };
  },
};

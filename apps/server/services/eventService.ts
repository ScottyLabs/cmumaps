import {
  CurrentEventResponse,
  EventResponse,
  EventsResponse,
  EventTrack,
} from "@cmumaps/common";
import { prisma } from "@cmumaps/db";

export const eventService = {
  async getEventById(eventId: string): Promise<EventResponse> {
    const dbEvent = await prisma.eventOccurrence.findUnique({
      where: { eventOccurrenceId: eventId },
      include: {
        event: { include: { eventTracks: { include: { track: true } } } },
        location: true,
      },
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
      tracks: dbEvent.event.eventTracks.map(
        (track) => track.track.trackName,
      ) as EventTrack[],
    };

    return { event };
  },

  async getCurrentEvent(
    timestamp: number,
    tracks: string[],
    reqs: string[],
  ): Promise<CurrentEventResponse> {
    // fetch event that are currently happening or will happen in the next 15 minutes
    const dbEvents = await prisma.eventOccurrence.findMany({
      where: {
        startTime: { lte: new Date(timestamp + 15 * 60 * 1000) },
        endTime: { gte: new Date(timestamp) },
        event: {
          OR: [{ req: { in: reqs } }, { req: null }],
          eventTracks: { some: { track: { trackName: { in: tracks } } } },
        },
      },
      include: {
        event: { include: { eventTracks: { include: { track: true } } } },
        location: true,
      },
    });

    if (!dbEvents) {
      throw new Error("Event not found");
    }

    const events = dbEvents.map((dbEvent) => ({
      id: dbEvent.eventOccurrenceId,
      location: dbEvent.location.locationName,
      latitude: dbEvent.location.latitude,
      longitude: dbEvent.location.longitude,
      tracks: dbEvent.event.eventTracks.map(
        (track) => track.track.trackName,
      ) as EventTrack[],
    }));

    return { events };
  },

  async getEventsByTimestamp(
    timestamp: number,
    limit: number,
    tracks: string[],
    reqs: string[],
  ): Promise<EventsResponse> {
    const dbEvents = await prisma.eventOccurrence.findMany({
      where: {
        startTime: { gte: new Date(timestamp) },
        event: {
          OR: [{ req: { in: reqs } }, { req: null }],
          eventTracks: { some: { track: { trackName: { in: tracks } } } },
        },
      },
      include: {
        event: { include: { eventTracks: { include: { track: true } } } },
        location: true,
      },
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
      latitude: dbEvent.location.latitude,
      longitude: dbEvent.location.longitude,
      tracks: dbEvent.event.eventTracks.map(
        (track) => track.track.trackName,
      ) as EventTrack[],
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
    tracks: string[],
    reqs: string[],
  ): Promise<EventsResponse> {
    const dbEvents = await prisma.eventOccurrence.findMany({
      where: {
        event: {
          OR: [{ req: { in: reqs } }, { req: null }],
          eventTracks: { some: { track: { trackName: { in: tracks } } } },
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
      include: {
        event: { include: { eventTracks: { include: { track: true } } } },
        location: true,
      },
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
      latitude: dbEvent.location.latitude,
      longitude: dbEvent.location.longitude,
      tracks: dbEvent.event.eventTracks.map(
        (track) => track.track.trackName,
      ) as EventTrack[],
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
    tracks: string[],
    reqs: string[],
  ): Promise<EventsResponse> {
    const dbEvents = await prisma.eventOccurrence.findMany({
      where: {
        event: {
          OR: [{ req: { in: reqs } }, { req: null }],
          eventTracks: { some: { track: { trackName: { in: tracks } } } },
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
      include: {
        event: { include: { eventTracks: { include: { track: true } } } },
        location: true,
      },
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
      latitude: dbEvent.location.latitude,
      longitude: dbEvent.location.longitude,
      tracks: dbEvent.event.eventTracks.map(
        (track) => track.track.trackName,
      ) as EventTrack[],
    }));
    const reversedEvents = events.reverse();
    const prevEvent = reversedEvents[0];
    const nextEvent = reversedEvents[limit - 1];
    return { events: reversedEvents, prevEvent, nextEvent };
  },
};

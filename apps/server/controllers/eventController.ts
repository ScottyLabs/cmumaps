import { Request, Response } from "express";
import { eventService } from "../services/eventService";

export const eventController = {
  getEvents: async (req: Request, res: Response) => {
    const { eventId, timestamp, limit, direction } = req.query;

    // get events by timestamp
    if (timestamp) {
      const { events, nextEventId, prevEventId } =
        await eventService.getEventsByTimestamp(
          Number(timestamp),
          Number(limit),
        );

      res.json({ events, prevEventId, nextEventId });
    }

    // get events by eventId
    if (eventId && typeof eventId === "string") {
      if (direction === "future") {
        const { prevEventId, events, nextEventId } =
          await eventService.getEventsAfter(eventId, Number(limit));

        res.json({ prevEventId, events, nextEventId });
      } else if (direction === "past") {
        const { prevEventId, events, nextEventId } =
          await eventService.getEventsBefore(eventId, Number(limit));

        res.json({ events, prevEventId, nextEventId });
      }
    }

    // no eventId or timestamp provided
    res.json({ error: "No eventId or timestamp provided" });
  },
};

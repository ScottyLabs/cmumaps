import { Request, Response } from "express";
import { eventService } from "../services/eventService";

export const eventController = {
  getEvents: async (req: Request, res: Response) => {
    const { eventId, timestamp, limit, direction } = req.query;

    // get events by timestamp
    if (!eventId) {
      const { events, nextEventId, prevEventId, nextTimestamp, prevTimestamp } =
        await eventService.getEventsByTimestamp(
          Number(timestamp),
          Number(limit),
        );

      res.json({
        events,
        prevEventId,
        nextEventId,
        nextTimestamp,
        prevTimestamp,
      });
      return;
    }

    // get events by eventId
    if (eventId && typeof eventId === "string") {
      if (direction === "future") {
        console.log("getting events after", eventId);
        const {
          prevEventId,
          events,
          nextEventId,
          prevTimestamp,
          nextTimestamp,
        } = await eventService.getEventsAfter(
          eventId,
          Number(timestamp),
          Number(limit),
        );

        res.json({
          prevEventId,
          events,
          nextEventId,
          prevTimestamp,
          nextTimestamp,
        });
        return;
      } else if (direction === "past") {
        const { prevEventId, events, nextEventId } =
          await eventService.getEventsBefore(
            eventId,
            Number(timestamp),
            Number(limit),
          );

        res.json({ events, prevEventId, nextEventId });
        return;
      }
    }

    // no eventId or timestamp provided
    res.json({ error: "No eventId or timestamp provided" });
  },
};

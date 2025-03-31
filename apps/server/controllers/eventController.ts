import { Request, Response } from "express";
import { eventService } from "../services/eventService";

export const eventController = {
  getEvents: async (req: Request, res: Response) => {
    const { timestamp, eventId, startTime, endTime, limit, direction } =
      req.query;

    // get events by timestamp
    if (timestamp) {
      const response = await eventService.getEventsByTimestamp(
        Number(timestamp),
        Number(limit),
      );

      res.json(response);
      return;
    }

    // get events by eventId
    if (eventId && typeof eventId === "string") {
      if (direction === "future") {
        const response = await eventService.getEventsAfter(
          eventId,
          Number(startTime),
          Number(endTime),
          Number(limit),
        );

        res.json(response);
        return;
      } else if (direction === "past") {
        const response = await eventService.getEventsBefore(
          eventId,
          Number(startTime),
          Number(endTime),
          Number(limit),
        );

        res.json(response);
        return;
      }
    }

    // no eventId or timestamp provided
    res.json({ error: "No eventId or timestamp provided" });
  },
};

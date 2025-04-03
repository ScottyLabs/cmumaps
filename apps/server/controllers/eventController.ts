import { Request, Response } from "express";

import { eventService } from "../services/eventService";

export const eventController = {
  getEvents: async (req: Request, res: Response) => {
    const {
      timestamp,
      eventId,
      startTime,
      endTime,
      limit,
      direction,
      filters,
      reqs,
    } = req.query;

    const filtersArray: string[] = filters
      ? (filters as string).split(",")
      : [];
    const reqsArray: string[] = reqs
      ? (reqs as string).split(",").map((req) => req.toLowerCase())
      : [];

    // get events by timestamp
    if (timestamp) {
      const response = await eventService.getEventsByTimestamp(
        Number(timestamp),
        Number(limit),
        filtersArray,
        reqsArray,
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
          filtersArray,
          reqsArray,
        );

        res.json(response);
        return;
      } else if (direction === "past") {
        const response = await eventService.getEventsBefore(
          eventId,
          Number(startTime),
          Number(endTime),
          Number(limit),
          filtersArray,
          reqsArray,
        );

        res.json(response);
        return;
      }
    }

    // no eventId or timestamp provided
    res.json({ error: "No eventId or timestamp provided" });
  },
};

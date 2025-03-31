import { Request, Response } from "express";
import { eventService } from "../services/eventService";

export const eventController = {
  getEvents: async (req: Request, res: Response) => {
    const { timestamp, limit } = req.query;

    const events = await eventService.getEvents(
      Number(timestamp),
      Number(limit),
    );

    // infinite query will call this endpoint with the next index (depend on the direction)
    const prevTimestamp = Number(timestamp) - Number(limit);
    const nextTimestamp = Number(timestamp) + Number(limit);
    console.log(events);
    res.json({ events, prevTimestamp, nextTimestamp });
  },
};

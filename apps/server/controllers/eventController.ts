import { Request, Response } from "express";
import { eventService } from "../services/eventService";

export const eventController = {
  getEvents: async (req: Request, res: Response) => {
    const { timestamp } = req.query;

    console.log(req.query);
    const events = await eventService.getEvents(Number(timestamp));

    console.log(req.params);

    // infinite query will call this endpoint with the next index (depend on the direction)
    const prevTimestamp = Number(timestamp) - 10;
    const nextTimestamp = Number(timestamp) + 10;
    console.log(events);
    res.json({ events, prevTimestamp, nextTimestamp });
  },
};

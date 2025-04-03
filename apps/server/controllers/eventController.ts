import { Request, Response } from "express";

import { handleControllerError } from "../errors/errorHandler";
import { eventService } from "../services/eventService";

export const eventController = {
  getEvent: async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const response = await eventService.getEventById(eventId);
      res.json(response);
    } catch (error) {
      handleControllerError(res, error, "getting event");
    }
  },

  getCurrentEvent: async (req: Request, res: Response) => {
    const { timestamp, tracks, reqs } = req.query;

    try {
      const tracksArray: string[] = tracks ? (tracks as string).split(",") : [];
      const reqsArray: string[] = reqs
        ? (reqs as string).split(",").map((req) => req.toLowerCase())
        : [];

      const response = await eventService.getCurrentEvent(
        Number(timestamp),
        tracksArray,
        reqsArray,
      );
      res.json(response);
    } catch (error) {
      handleControllerError(res, error, "getting current event");
    }
  },

  getEvents: async (req: Request, res: Response) => {
    const {
      timestamp,
      eventId,
      startTime,
      endTime,
      limit,
      direction,
      tracks,
      reqs,
    } = req.query;

    try {
      const tracksArray: string[] = tracks ? (tracks as string).split(",") : [];
      const reqsArray: string[] = reqs
        ? (reqs as string).split(",").map((req) => req.toLowerCase())
        : [];

      // get events by timestamp
      if (timestamp) {
        const response = await eventService.getEventsByTimestamp(
          Number(timestamp),
          Number(limit),
          tracksArray,
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
            tracksArray,
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
            tracksArray,
            reqsArray,
          );

          res.json(response);
          return;
        }
      }

      // no eventId or timestamp provided
      res.json({ error: "No eventId or timestamp provided" });
    } catch (error) {
      handleControllerError(res, error, "getting events");
    }
  },
};

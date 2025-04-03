import express from "express";

import { eventController } from "../controllers/eventController";

const eventRouter = express.Router();

eventRouter.get("/", eventController.getEvents);
eventRouter.get("/:eventId", eventController.getEvent);

export default eventRouter;

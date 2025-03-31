import express from "express";
import { eventController } from "../controllers/eventController";

const eventRouter = express.Router();

eventRouter.get("/", eventController.getEvents);

export default eventRouter;

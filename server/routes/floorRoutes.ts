import express from "express";
import { floorController } from "../controllers/floorController.ts";

const floorRouter = express.Router();

floorRouter.get("/:id/graph", floorController.getFloorGraph);
floorRouter.get("/:id/rooms", floorController.getFloorRooms);

export default floorRouter;

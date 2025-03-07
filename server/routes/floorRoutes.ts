import express from "express";
import { floorController } from "../controllers/floorController.ts";

const floorRouter = express.Router();

floorRouter.get("/:id/graph", floorController.getFloorGraph);

export default floorRouter;

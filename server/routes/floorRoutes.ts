import express from "express";
import { floorController } from "../controllers/floorController.ts";

const floorRouter = express.Router();

floorRouter.get("/:id/nodes", floorController.getFloorNodes);

export default floorRouter;

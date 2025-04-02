import express from "express";

import { edgeController } from "../controllers/edgeController";

const edgeRouter = express.Router();

edgeRouter.post("/edge", edgeController.createEdge);
edgeRouter.delete("/edge", edgeController.deleteEdge);
edgeRouter.post("/cross-floor-edge", edgeController.createEdgeAcrossFloors);
edgeRouter.delete("/cross-floor-edge", edgeController.deleteEdgeAcrossFloors);

export default edgeRouter;

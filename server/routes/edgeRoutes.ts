import express from "express";
import { edgeController } from "../controllers/edgeController.ts";

const edgeRouter = express.Router();

edgeRouter.post("/", edgeController.createEdge);
edgeRouter.delete("/", edgeController.deleteEdge);

export default edgeRouter;

import express from "express";
import { nodeController } from "../controllers/nodeController.ts";

const nodeRouter = express.Router();

nodeRouter.get("/", nodeController.getFloorNodes);
nodeRouter.post("/:id", nodeController.createNode);
nodeRouter.put("/:id", nodeController.updateNode);
nodeRouter.delete("/:id", nodeController.deleteNode);

export default nodeRouter;

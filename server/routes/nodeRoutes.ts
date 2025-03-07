import express from "express";
import { nodeController } from "../controllers/nodeController.ts";
import { requireSocketId } from "../middleware/socketIdMiddleware.ts";

const nodeRouter = express.Router();

nodeRouter.get("/", nodeController.getFloorNodes);
nodeRouter.post("/:id", requireSocketId, nodeController.createNode);
nodeRouter.put("/:id", requireSocketId, nodeController.updateNode);
nodeRouter.delete("/:id", requireSocketId, nodeController.deleteNode);

export default nodeRouter;

import type { Request, Response } from "express";
import { nodeService } from "../services/nodeService.ts";
import { floorService } from "../services/floorService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";
import { websocketService } from "../index.ts";

export const nodeController = {
  createNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;
    const sid = req.socketId;

    try {
      // create node in database
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.createNode(sid, floorCode, nodeId, nodeInfo, placement);

      // broadcast to all users on the floor
      const payload = { nodeId, nodeInfo };
      websocketService.broadcastToFloor(sid, "create-node", payload);

      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating node");
    }
  },

  deleteNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const sid = req.socketId;

    try {
      await nodeService.deleteNode(sid, nodeId);
      websocketService.broadcastToFloor(sid, "delete-node", { nodeId });
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting node");
    }
  },

  updateNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;
    const sid = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.updateNode(sid, floorCode, nodeId, nodeInfo, placement);
      const payload = { nodeId, nodeInfo };
      websocketService.broadcastToFloor(sid, "update-node", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating node");
    }
  },
};

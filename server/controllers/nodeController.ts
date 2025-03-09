import type { Request, Response } from "express";
import { nodeService } from "../services/nodeService.ts";
import { floorService } from "../services/floorService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";
import { webSocketService } from "../index.ts";

export const nodeController = {
  createNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;
    const socketId = req.socketId;

    try {
      // create node in database
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.upsertNode(floorCode, nodeId, nodeInfo, placement);

      // broadcast to all users on the floor
      const payload = { nodeId, nodeInfo };
      webSocketService.broadcastToUserFloor(socketId, "create-node", payload);

      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating node");
    }
  },

  deleteNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const socketId = req.socketId;

    try {
      await nodeService.deleteNode(nodeId);
      webSocketService.broadcastToUserFloor(socketId, "delete-node", {
        nodeId,
      });
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting node");
    }
  },

  updateNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;
    const socketId = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.upsertNode(floorCode, nodeId, nodeInfo, placement);
      const payload = { nodeId, nodeInfo };
      webSocketService.broadcastToUserFloor(socketId, "update-node", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating node");
    }
  },
};

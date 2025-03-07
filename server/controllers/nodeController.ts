import type { Request, Response } from "express";
import { nodeService } from "../services/nodeService.ts";
import { floorService } from "../services/floorService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";

export const nodeController = {
  getFloorNodes: async (req: Request, res: Response) => {
    const { floorCode } = req.query;

    if (!floorCode) {
      res.status(400).json({ message: "floorCode is required" });
      return;
    }

    try {
      const typedFloorCode = floorCode as string;
      const placement = await floorService.getFloorPlacement(typedFloorCode);
      const nodes = await nodeService.getFloorNodes(typedFloorCode, placement);
      res.json(nodes);
    } catch (error) {
      console.error("Error getting floor nodes", error);
      res.status(500).json({
        error: "Error getting floor nodes",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  createNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;
    const sid = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.createNode(sid, floorCode, nodeId, nodeInfo, placement);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating node");
    }
  },

  deleteNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const socketId = req.socketId;

    try {
      await nodeService.deleteNode(socketId, nodeId);
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
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating node");
    }
  },
};

import type { Request, Response } from "express";
import { nodeService } from "../services/nodeService.ts";
import { floorService } from "../services/floorService.ts";

export const nodeController = {
  getFloorNodes: async (req: Request, res: Response) => {
    const { floorCode } = req.query;

    if (!floorCode) {
      res.status(400).json({ message: "floorCode is required" });
      return;
    }

    const typedFloorCode = floorCode as string;
    const placement = await floorService.getFloorPlacement(typedFloorCode);
    const nodes = await nodeService.getFloorNodes(typedFloorCode, placement);
    res.json(nodes);
  },

  createNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { socketId, floorCode, nodeInfo } = req.body;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.createNode(
        socketId,
        floorCode,
        nodeId,
        nodeInfo,
        placement
      );
      res.json(null);
    } catch (error) {
      console.error("Error creating node", error);
      res.status(500).json({
        error: "Error creating node",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  deleteNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const socketId = req.header("X-Socket-ID");

    if (!socketId) {
      res.status(400).json({ message: "X-Socket-ID header is required" });
      return;
    }

    try {
      await nodeService.deleteNode(socketId, nodeId);
      res.json(null);
    } catch (error) {
      console.error("Error deleting node", error);
      res.status(500).json({
        error: "Error deleting node",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
};

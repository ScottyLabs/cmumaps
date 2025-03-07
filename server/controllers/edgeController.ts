import type { Request, Response } from "express";
import { edgeService } from "../services/edgeService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";

export const edgeController = {
  createEdge: async (req: Request, res: Response) => {
    const { inNodeId, outNodeId } = req.body;
    // const socketId = req.socketId;

    try {
      // create edge in database
      await edgeService.createEdge(inNodeId, outNodeId);

      // broadcast to all users on the floor
      //   const payload = { inNodeId, outNodeId };
      //   webSocketService.broadcastToFloor(socketId, "create-edge", payload);

      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating edge");
    }
  },

  deleteEdge: async (req: Request, res: Response) => {
    const { inNodeId, outNodeId } = req.body;
    // const socketId = req.socketId;

    try {
      await edgeService.deleteEdge(inNodeId, outNodeId);
      // const payload = { inNodeId, outNodeId };
      // webSocketService.broadcastToFloor(socketId, "delete-edge", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting edge");
    }
  },
};

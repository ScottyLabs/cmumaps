import type { Request, Response } from "express";
import { edgeService } from "../services/edgeService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";
import { webSocketService } from "../index.ts";

export const edgeController = {
  createEdge: async (req: Request, res: Response) => {
    const { inNodeId, outNodeId } = req.body;
    const socketId = req.socketId;

    try {
      // create edge in database
      await edgeService.createEdge(inNodeId, outNodeId);

      // broadcast to all users on the floor
      const payload = { inNodeId, outNodeId };
      webSocketService.broadcastToUserFloor(socketId, "create-edge", payload);

      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating edge");
    }
  },

  deleteEdge: async (req: Request, res: Response) => {
    const { inNodeId, outNodeId } = req.body;
    const socketId = req.socketId;

    try {
      await edgeService.deleteEdge(inNodeId, outNodeId);
      const payload = { inNodeId, outNodeId };
      webSocketService.broadcastToUserFloor(socketId, "delete-edge", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting edge");
    }
  },

  createEdgeAcrossFloors: async (req: Request, res: Response) => {
    const { outFloorCode, inNodeId, outNodeId } = req.body;
    const socketId = req.socketId;

    try {
      await edgeService.createEdge(inNodeId, outNodeId);
      const payload = { outFloorCode, inNodeId, outNodeId };
      webSocketService.broadcastToUserFloor(
        socketId,
        "create-edge-across-floors",
        payload
      );

      const inPayload = {
        outFloorCode,
        outNodeId: inNodeId,
        inNodeId: outNodeId,
      };
      webSocketService.broadcastToFloor(
        outFloorCode,
        "create-edge-across-floors",
        inPayload
      );
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating edge across floors");
    }
  },

  deleteEdgeAcrossFloors: async (req: Request, res: Response) => {
    const { outFloorCode, inNodeId, outNodeId } = req.body;
    const socketId = req.socketId;

    try {
      await edgeService.deleteEdge(inNodeId, outNodeId);
      const payload = { outFloorCode, inNodeId, outNodeId };
      webSocketService.broadcastToUserFloor(
        socketId,
        "delete-edge-across-floors",
        payload
      );

      const inPayload = {
        outFloorCode,
        outNodeId: inNodeId,
        inNodeId: outNodeId,
      };
      webSocketService.broadcastToFloor(
        outFloorCode,
        "delete-edge-across-floors",
        inPayload
      );
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating edge across floors");
    }
  },
};

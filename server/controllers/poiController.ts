import type { Request, Response } from "express";
import { poiService } from "../services/poiService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";
import { webSocketService } from "../index.ts";

export const poiController = {
  createPoi: async (req: Request, res: Response) => {
    const poiId = req.params.id;
    const { floorCode, poiInfo } = req.body;
    const socketId = req.socketId;

    try {
      await poiService.createPoi(floorCode, poiId, poiInfo);
      const payload = { poiId, poiInfo };
      webSocketService.broadcastToUserFloor(socketId, "create-poi", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating POI");
    }
  },

  deletePoi: async (req: Request, res: Response) => {
    const poiId = req.params.id;
    const socketId = req.socketId;

    try {
      await poiService.deletePoi(poiId);
      const payload = { poiId };
      webSocketService.broadcastToUserFloor(socketId, "delete-poi", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting POI");
    }
  },

  updatePoi: async (req: Request, res: Response) => {
    const poiId = req.params.id;
    const { poiInfo } = req.body;
    const socketId = req.socketId;

    try {
      await poiService.updatePoi(poiId, poiInfo);
      const payload = { poiId, poiInfo };
      webSocketService.broadcastToUserFloor(socketId, "update-poi", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating POI");
    }
  },
};

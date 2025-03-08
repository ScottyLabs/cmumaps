import type { Request, Response } from "express";
import { roomService } from "../services/roomService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";
import { floorService } from "../services/floorService.ts";

export const roomController = {
  createRoom: async (req: Request, res: Response) => {
    const { floorCode, elementId, roomInfo } = req.body;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await roomService.createRoom(floorCode, elementId, roomInfo, placement);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating room");
    }
  },

  deleteRoom: async (req: Request, res: Response) => {
    const elementId = req.params.elementId;
    try {
      await roomService.deleteRoom(elementId);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting room");
    }
  },

  updateRoom: async (req: Request, res: Response) => {
    const { floorCode, elementId, roomInfo } = req.body;
    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await roomService.createRoom(floorCode, elementId, roomInfo, placement);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating room");
    }
  },
};

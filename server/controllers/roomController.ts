import type { Request, Response } from "express";
import { roomService } from "../services/roomService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";
import { floorService } from "../services/floorService.ts";
import { webSocketService } from "../index.ts";

export const roomController = {
  createRoom: async (req: Request, res: Response) => {
    const roomId = req.params.id;
    const { floorCode, roomInfo } = req.body;
    const socketId = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await roomService.createRoom(floorCode, roomId, roomInfo, placement);
      const payload = { roomId, roomInfo };
      webSocketService.broadcastToUserFloor(socketId, "create-room", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating room");
    }
  },

  deleteRoom: async (req: Request, res: Response) => {
    const roomId = req.params.id;
    const socketId = req.socketId;
    try {
      await roomService.deleteRoom(roomId);
      const payload = { roomId };
      webSocketService.broadcastToUserFloor(socketId, "delete-room", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting room");
    }
  },

  updateRoom: async (req: Request, res: Response) => {
    const roomId = req.params.id;
    const { floorCode, roomInfo } = req.body;
    const socketId = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await roomService.updateRoom(roomId, roomInfo, placement);
      const payload = { roomId, roomInfo };
      webSocketService.broadcastToUserFloor(socketId, "update-room", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating room");
    }
  },
};

import type { Request, Response } from "express";
import { floorService } from "../services/floorService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";

export const floorController = {
  getFloorGraph: async (req: Request, res: Response) => {
    const floorCode = req.params.id;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      const graph = await floorService.getFloorGraph(floorCode, placement);
      res.json(graph);
    } catch (error) {
      handleControllerError(res, error, "getting floor nodes");
    }
  },

  getFloorRooms: async (req: Request, res: Response) => {
    const floorCode = req.params.id;

    try {
      const rooms = await floorService.getFloorRooms(floorCode);
      res.json(rooms);
    } catch (error) {
      handleControllerError(res, error, "getting floor rooms");
    }
  },
};

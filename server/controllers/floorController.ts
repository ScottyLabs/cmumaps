import type { Request, Response } from "express";
import { floorService } from "../services/floorService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";

export const floorController = {
  getFloorNodes: async (req: Request, res: Response) => {
    const floorCode = req.params.id;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      const nodes = await floorService.getFloorNodes(floorCode, placement);
      res.json(nodes);
    } catch (error) {
      handleControllerError(res, error, "getting floor nodes");
    }
  },
};

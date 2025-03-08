import type { Request, Response } from "express";
import { poiService } from "../services/poiService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";

export const poiController = {
  createPoi: async (req: Request, res: Response) => {
    const elementId = req.params.id;
    const { floorCode, poiType } = req.body;
    try {
      await poiService.createPoi(floorCode, elementId, poiType);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating POI");
    }
  },

  deletePoi: async (req: Request, res: Response) => {
    const elementId = req.params.id;
    try {
      await poiService.deletePoi(elementId);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting POI");
    }
  },

  updatePoi: async (req: Request, res: Response) => {
    const elementId = req.params.id;
    const { poiType } = req.body;
    try {
      await poiService.updatePoi(elementId, poiType);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating POI");
    }
  },
};

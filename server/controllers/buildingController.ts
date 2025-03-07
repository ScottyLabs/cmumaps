import type { Request, Response } from "express";
import { BuildingError } from "../errors/error.ts";
import { buildingService } from "../services/buildingService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";

export const buildingController = {
  async getBuildingCodesAndNames(req: Request, res: Response) {
    try {
      const buildingCodesAndNames =
        await buildingService.getAllBuildingCodesAndNames();

      res.json(buildingCodesAndNames);
    } catch (error) {
      handleControllerError(res, error, "fetching building codes and names");
    }
  },

  async getDefaultFloor(req: Request, res: Response) {
    try {
      const defaultFloor = await buildingService.getDefaultFloor(req.params.id);

      res.json(defaultFloor);
    } catch (error) {
      if (error instanceof BuildingError) {
        res.status(404).json({ code: error.code });
        return;
      }

      handleControllerError(res, error, "getting default floor");
    }
  },

  async getBuildingFloors(req: Request, res: Response) {
    try {
      const buildingFloors = await buildingService.getBuildingFloors(
        req.params.id
      );

      res.json(buildingFloors);
    } catch (error) {
      if (error instanceof BuildingError) {
        res.status(404).json({ code: error.code });
        return;
      }

      handleControllerError(res, error, "getting building floors");
    }
  },
};

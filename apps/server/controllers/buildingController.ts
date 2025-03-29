import type { Request, Response } from "express";
import { BuildingError } from "../errors/error";
import { buildingService } from "../services/buildingService";
import { handleControllerError } from "../errors/errorHandler";

export const buildingController = {
  async getBuildings(req: Request, res: Response) {
    try {
      const buildings = await buildingService.getBuildings();
      res.json(buildings);
    } catch (error) {
      handleControllerError(res, error, "getting buildings");
    }
  },

  async getBuildingCodesAndNames(req: Request, res: Response) {
    try {
      const buildingCodesAndNames =
        await buildingService.getAllBuildingCodesAndNames();

      res.json(buildingCodesAndNames);
    } catch (error) {
      handleControllerError(res, error, "fetching building codes and names");
    }
  },

  async getBuildingName(req: Request, res: Response) {
    try {
      const buildingName = await buildingService.getBuildingName(req.params.id);
      res.json(buildingName);
    } catch (error) {
      handleControllerError(res, error, "getting building name");
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
        req.params.id,
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

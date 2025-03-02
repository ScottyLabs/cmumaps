import type { Request, Response } from 'express';
import { buildingService } from '../services/buildingService.ts';
import { BuildingError } from '../errors/error.ts';

export const buildingController = {
  async getBuildingCodesAndNames(req: Request, res: Response) {
    try {
      const buildingCodesAndNames =
        await buildingService.getAllBuildingCodesAndNames();

      res.json(buildingCodesAndNames);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching building codes and names',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async getDefaultFloor(req: Request, res: Response) {
    try {
      const defaultFloor = await buildingService.getDefaultFloor(req.params.id);

      res.json(defaultFloor);
    } catch (error) {
      if (error instanceof BuildingError) {
        return res.status(404).json({ code: error.code });
      }

      res.status(500).json({
        error: 'Error fetching building codes',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
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
        return res.status(404).json({ code: error.code });
      }

      res.status(500).json({
        error: 'Error fetching building floors',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};

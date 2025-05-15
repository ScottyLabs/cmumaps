import { Request, Response } from "express";

import { handleControllerError } from "../errors/errorHandler";
import { populateTableService } from "../services/populateTableService";

export const populateTableController = {
  populateBuildings: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await populateTableService.populateBuildings(data);
      res.status(200).json({ message: "Buildings populated" });
    } catch (error) {
      handleControllerError(res, error, "populating buildings");
    }
  },
  populateFloors: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await populateTableService.populateFloors(data);
      res.status(200).json({ message: "Floors populated" });
    } catch (error) {
      handleControllerError(res, error, "populating floors");
    }
  },
};

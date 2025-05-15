import type { Request, Response } from "express";

import { handleControllerError } from "../errors/errorHandler";
import { dropTablesService } from "../services/dropTablesService";

export const dropTablesController = {
  async dropTables(req: Request, res: Response) {
    try {
      const { tableNames } = req.body;
      await dropTablesService.dropTables(tableNames);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "dropping tables");
    }
  },
};

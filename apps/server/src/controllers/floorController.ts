import type { Request, Response } from "express";
import { Get, Middlewares, Path, Route } from "tsoa";
import { handleControllerError } from "../errors/errorHandler";
import { checkAuth } from "../middleware/authMiddleware";
import { floorService } from "../services/floorService";

@Route("/floors")
export class FloorController {
  async getFloorGraph(req: Request, res: Response) {
    const floorCode = req.params.id;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      const graph = await floorService.getFloorGraph(floorCode, placement);
      res.json(graph);
    } catch (error) {
      handleControllerError(res, error, "getting floor nodes");
    }
  }

  async getFloorRooms(req: Request, res: Response) {
    const floorCode = req.params.id;

    try {
      const rooms = await floorService.getFloorRooms(floorCode);
      res.json(rooms);
    } catch (error) {
      handleControllerError(res, error, "getting floor rooms");
    }
  }

  async getFloorPois(req: Request, res: Response) {
    const floorCode = req.params.id;

    try {
      const pois = await floorService.getFloorPois(floorCode);
      res.json(pois);
    } catch (error) {
      handleControllerError(res, error, "getting floor pois");
    }
  }

  @Get("/:floorCode/floorplan")
  @Middlewares(checkAuth)
  async getFloorplan(@Path() floorCode: string) {
    return await floorService.getFloorplan(floorCode);
  }
}

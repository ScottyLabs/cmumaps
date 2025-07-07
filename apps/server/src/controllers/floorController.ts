import type * as express from "express";
import { Get, Path, Route, Security } from "tsoa";
import { handleControllerError } from "../errors/errorHandler";
import { floorService } from "../services/floorService";

@Route("/floors")
export class FloorController {
  async getFloorGraph(req: express.Request, res: express.Response) {
    const floorCode = req.params.id;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      const graph = await floorService.getFloorGraph(floorCode, placement);
      res.json(graph);
    } catch (error) {
      handleControllerError(res, error, "getting floor nodes");
    }
  }

  async getFloorRooms(req: express.Request, res: express.Response) {
    const floorCode = req.params.id;

    try {
      const rooms = await floorService.getFloorRooms(floorCode);
      res.json(rooms);
    } catch (error) {
      handleControllerError(res, error, "getting floor rooms");
    }
  }

  async getFloorPois(req: express.Request, res: express.Response) {
    const floorCode = req.params.id;

    try {
      const pois = await floorService.getFloorPois(floorCode);
      res.json(pois);
    } catch (error) {
      handleControllerError(res, error, "getting floor pois");
    }
  }

  @Security("bearerAuth", [])
  @Get("/:floorCode/floorplan")
  public async getFloorplan(@Path() floorCode: string) {
    return await floorService.getFloorplan(floorCode);
  }
}

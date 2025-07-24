import type * as express from "express";
import { Get, Path, Route, Security } from "tsoa";
import { handleControllerError } from "../errors/errorHandler";
import { floorService } from "../services/floorService";

@Route("/floors")
export class FloorController {
  @Security("oauth2", [])
  @Get("/:floorCode/floorplan")
  async getFloorplan(@Path() floorCode: string) {
    return await floorService.getFloorplan(floorCode);
  }

  @Security("oauth2", [])
  @Get("/:floorCode/georooms")
  async getFloorRooms(@Path() floorCode: string) {
    const rooms = await floorService.getFloorRooms(floorCode);
    return rooms;
  }

  @Security("oauth2", [])
  @Get("/:floorCode/graph")
  async getFloorGraph(@Path() floorCode: string) {
    const placement = await floorService.getFloorPlacement(floorCode);
    const graph = await floorService.getFloorGraph(floorCode, placement);
    return graph;
  }

  @Security("oauth2", [])
  @Get("/:floorCode/geonodes")
  async getFloorNodes(@Path() floorCode: string) {
    return await floorService.getFloorNodes(floorCode);
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
}

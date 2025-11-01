import type { Placement } from "@cmumaps/common";
import { Body, Get, Path, Put, Route, Security } from "tsoa";
import { BEARER_AUTH, MEMBER_SCOPE } from "../middleware/authentication";
import { floorService } from "../services/floorService";

@Security(BEARER_AUTH, [])

@Route("floors")
export class FloorController {
  @Get("/:floorCode/floorplan")
  async getFloorplan(@Path() floorCode: string) {
    return await floorService.getFloorplan(floorCode);
  }

  @Get("/:floorCode/rooms")
  async getFloorRooms(@Path() floorCode: string) {
    const rooms = await floorService.getFloorRooms(floorCode);
    return rooms;
  }

  @Get("/:floorCode/graph")
  async getFloorGraph(@Path() floorCode: string) {
    const placement = await floorService.getFloorPlacement(floorCode);
    const graph = await floorService.getFloorGraph(floorCode, placement);
    return graph;
  }

  @Get("/:floorCode/geonodes")
  async getFloorNodes(@Path() floorCode: string) {
    return await floorService.getFloorNodes(floorCode);
  }

  @Get("/:floorCode/pois")
  async getFloorPois(@Path() floorCode: string) {
    return await floorService.getFloorPois(floorCode);
  }

  @Get("/:floorCode/placement")
  async getFloorPlacement(@Path() floorCode: string) {
    return await floorService.getFloorPlacement(floorCode);
  }

  @Security(BEARER_AUTH, [MEMBER_SCOPE])
  @Put("/:floorCode/placement")
  async updateFloorPlacement(
    @Path() floorCode: string,
    @Body() body: { placement: Placement },
  ) {
    return await floorService.updateFloorPlacement(floorCode, body.placement);
  }
}

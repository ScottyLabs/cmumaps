import { Get, Path, Route, Security } from "tsoa";
import { floorService } from "../services/floorService";

@Route("floors")
export class FloorController {
  @Security("oauth2", [])
  @Get("/:floorCode/floorplan")
  async getFloorplan(@Path() floorCode: string) {
    return await floorService.getFloorplan(floorCode);
  }

  @Security("oauth2", [])
  @Get("/:floorCode/rooms")
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

  @Security("oauth2", [])
  @Get("/:floorCode/placement")
  async getFloorPlacement(@Path() floorCode: string) {
    return await floorService.getFloorPlacement(floorCode);
  }

  @Security("oauth2", [])
  @Get("/:floorCode/pois")
  async getFloorPois(@Path() floorCode: string) {
    return await floorService.getFloorPois(floorCode);
  }
}

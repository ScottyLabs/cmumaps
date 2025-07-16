/** biome-ignore-all lint/suspicious/noExplicitAny: <Just for populating table> */
import { Body, Post, Route } from "tsoa";
import { populateTableService } from "../services/populateTableService";

@Route("populate-table")
export class PopulateTableController {
  @Post("/buildings")
  async populateBuildings(@Body() data: any) {
    await populateTableService.populateBuildings(data);
    return { message: "Buildings populated" };
  }

  @Post("/floors")
  async populateFloors(@Body() data: any) {
    await populateTableService.populateFloors(data);
    return { message: "Floors populated" };
  }

  @Post("/rooms")
  async populateRooms(@Body() data: any) {
    await populateTableService.populateRooms(data);
    return { message: "Rooms populated" };
  }

  @Post("/alias")
  async populateAlias(@Body() data: any) {
    await populateTableService.populateAlias(data);
    return { message: "Alias populated" };
  }

  @Post("/nodes")
  async populateNodes(@Body() data: any) {
    await populateTableService.populateNodes(data);
    return { message: "Nodes populated" };
  }

  @Post("/edges")
  async populateEdges(@Body() data: any) {
    await populateTableService.populateEdges(data);
    return { message: "Edges populated" };
  }
}

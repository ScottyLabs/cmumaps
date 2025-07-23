/** biome-ignore-all lint/suspicious/noExplicitAny: <Just for populating table> */
import { Body, Post, Route, Security } from "tsoa";
import { populateTableService } from "../services/populateTableService";

@Route("populate-table")
export class PopulateTableController {
  @Security("oauth2", ["db_admin"])
  @Post("/buildings")
  async populateBuildings(@Body() data: any) {
    await populateTableService.populateBuildings(data);
    return { message: "Buildings populated" };
  }

  @Security("oauth2", ["db_admin"])
  @Post("/floors")
  async populateFloors(@Body() data: any) {
    await populateTableService.populateFloors(data);
    return { message: "Floors populated" };
  }

  @Security("oauth2", ["db_admin"])
  @Post("/rooms")
  async populateRooms(@Body() data: any) {
    await populateTableService.populateRooms(data);
    return { message: "Rooms populated" };
  }

  @Security("oauth2", ["db_admin"])
  @Post("/alias")
  async populateAlias(@Body() data: any) {
    await populateTableService.populateAlias(data);
    return { message: "Alias populated" };
  }

  @Security("oauth2", ["db_admin"])
  @Post("/nodes")
  async populateNodes(@Body() data: any) {
    await populateTableService.populateNodes(data);
    return { message: "Nodes populated" };
  }

  @Security("oauth2", ["db_admin"])
  @Post("/edges")
  async populateEdges(@Body() data: any) {
    await populateTableService.populateEdges(data);
    return { message: "Edges populated" };
  }
}

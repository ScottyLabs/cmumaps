import { Get, Path, Route } from "tsoa";
import { buildingService } from "../services/buildingService";

@Route("buildings")
export class BuildingController {
  @Get("/")
  async getBuildings() {
    return await buildingService.getBuildings();
  }

  @Get("/metadata")
  async getBuildingsMetadata() {
    return await buildingService.getBuildingsMetadata();
  }

  @Get("/:buildingCode/name")
  async getBuildingName(@Path() buildingCode: string) {
    return await buildingService.getBuildingName(buildingCode);
  }

  @Get("/:buildingCode/default-floor")
  async getDefaultFloor(@Path() buildingCode: string) {
    return await buildingService.getDefaultFloor(buildingCode);
  }

  @Get("/:buildingCode/floors")
  async getBuildingFloors(@Path() buildingCode: string) {
    return await buildingService.getBuildingFloors(buildingCode);
  }
}

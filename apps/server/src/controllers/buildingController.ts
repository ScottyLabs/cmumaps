import { Get, Path, Route } from "tsoa";
import { buildingService } from "../services/buildingService.ts";

@Route("buildings")
export class BuildingController {
  @Get("/")
  public async getBuildings() {
    return await buildingService.getBuildings();
  }

  @Get("/metadata")
  public async getBuildingsMetadata() {
    return await buildingService.getBuildingsMetadata();
  }

  @Get("/:buildingCode")
  public async getBuilding(@Path() buildingCode: string) {
    return await buildingService.getBuilding(buildingCode);
  }

  @Get("/:buildingCode/name")
  public async getBuildingName(@Path() buildingCode: string) {
    return await buildingService.getBuildingName(buildingCode);
  }

  @Get("/:buildingCode/default-floor")
  public async getDefaultFloor(@Path() buildingCode: string) {
    return await buildingService.getDefaultFloor(buildingCode);
  }

  @Get("/:buildingCode/floors")
  public async getBuildingFloors(@Path() buildingCode: string) {
    return await buildingService.getBuildingFloors(buildingCode);
  }
}

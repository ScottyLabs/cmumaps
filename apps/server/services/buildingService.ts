import { Buildings, ERROR_CODES, GeoCoordinate } from "@cmumaps/common";
import { prisma } from "../index";
import { BuildingError } from "../errors/error";

export const buildingService = {
  async getBuildings() {
    const dbBuildings = await prisma.building.findMany({
      select: {
        buildingCode: true,
        name: true,
        defaultOrdinal: true,
        labelLatitude: true,
        labelLongitude: true,
        shape: true,
        hitbox: true,
      },
    });

    const buildings: Buildings = {};
    for (const dbBuilding of dbBuildings) {
      buildings[dbBuilding.buildingCode] = {
        code: dbBuilding.buildingCode,
        name: dbBuilding.name,
        defaultOrdinal: dbBuilding.defaultOrdinal,
        defaultFloor: await this.getDefaultFloor(dbBuilding.buildingCode),
        labelLatitude: dbBuilding.labelLatitude,
        labelLongitude: dbBuilding.labelLongitude,
        shape: dbBuilding.shape as unknown as GeoCoordinate[][],
        hitbox: dbBuilding.hitbox as unknown as GeoCoordinate[],
        floors: await this.getBuildingFloors(dbBuilding.buildingCode),
        // TODO: need to add isMapped field to the database
        isMapped: true,
      };
    }
    return buildings;
  },

  async getAllBuildingCodesAndNames() {
    const buildings = await prisma.building.findMany({
      select: { buildingCode: true, name: true },
    });
    return buildings.sort((a, b) => a.name.localeCompare(b.name));
  },

  async getBuildingName(buildingCode: string) {
    const building = await prisma.building.findUnique({
      where: { buildingCode },
      select: { name: true },
    });
    return building?.name;
  },

  async getDefaultFloor(buildingCode: string) {
    const floor = await prisma.floor.findFirst({
      where: { buildingCode, isDefault: true },
    });

    if (!floor) {
      throw new BuildingError(ERROR_CODES.NO_DEFAULT_FLOOR);
    }

    return floor.floorLevel;
  },

  async getBuildingFloors(buildingCode: string) {
    const floorCodeOrder = [
      "PH",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
      "M",
      "1",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "LL",
      "EV",
    ];

    const floors = await prisma.floor.findMany({
      where: { buildingCode },
      select: { floorLevel: true },
    });

    const floorLevelSort = (f1: string, f2: string) => {
      return floorCodeOrder.indexOf(f2) - floorCodeOrder.indexOf(f1);
    };

    return floors.map((floor) => floor.floorLevel).sort(floorLevelSort);
  },
};

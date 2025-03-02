import { prisma } from '../index.ts';
import { INVALID_BUILDING_CODE } from '../../shared/errorCode.ts';
import { BuildingError } from '../errors/error.ts';

export const buildingService = {
  async getAllBuildingCodesAndNames() {
    const buildings = await prisma.building.findMany({
      select: { buildingCode: true, name: true },
    });
    return buildings.sort((a, b) => a.name.localeCompare(b.name));
  },

  async getDefaultFloor(buildingCode: string) {
    const building = await prisma.building.findUnique({
      where: { buildingCode },
      select: { defaultFloor: true },
    });

    if (!building) {
      throw new BuildingError(INVALID_BUILDING_CODE);
    }

    return building.defaultFloor;
  },
};

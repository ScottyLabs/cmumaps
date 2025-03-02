import { prisma } from '../index.ts';

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

    return building?.defaultFloor;
  },
};

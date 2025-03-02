import { prisma } from '../index.ts';

export const buildingService = {
  async getAllBuildingCodes() {
    const buildings = await prisma.building.findMany({
      select: { buildingCode: true },
    });
    return buildings.map((building) => building.buildingCode);
  },

  async getDefaultFloor(buildingCode: string) {
    const building = await prisma.building.findUnique({
      where: { buildingCode },
      select: { defaultFloor: true },
    });

    return building?.defaultFloor;
  },
};

import { prisma } from '../index.ts';

export const buildingService = {
  async getAllBuildingCodes() {
    const buildings = await prisma.building.findMany({
      select: { buildingCode: true },
    });
    return buildings.map((building) => building.buildingCode);
  },
};

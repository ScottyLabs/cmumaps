import { prisma } from '../index.ts';

export const buildingService = {
  async getAllBuildingCodes() {
    return await prisma.building.findMany({
      select: { buildingCode: true },
    });
  },
};

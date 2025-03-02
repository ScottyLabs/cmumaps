import { prisma } from '../index.ts';
import {
  extractBuildingCode,
  extractFloorLevel,
} from '../../shared/utils/floorCodeUtils.ts';

export const nodeService = {
  getFloorNodes: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const floor = await prisma.floor.findUnique({
      where: { buildingCode_floorLevel: { buildingCode, floorLevel } },
    });

    console.log(floor);

    const nodes = await prisma.node.findMany({
      where: { element: { buildingCode, floorLevel } },
    });

    return nodes;
  },
};

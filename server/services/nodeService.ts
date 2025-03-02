import { prisma } from '../index.ts';
import {
  extractBuildingCode,
  extractFloorLevel,
} from '../../shared/utils/floorCodeUtils.ts';

export const nodeService = {
  getNodes: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const nodes = await prisma.node.findMany({
      where: { element: { buildingCode, floorLevel } },
    });

    return nodes;
  },
};

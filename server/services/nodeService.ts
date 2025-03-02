import { prisma } from '../index.ts';
import {
  extractBuildingCode,
  extractFloorLevel,
} from '../../shared/utils/floorCodeUtils.ts';
import { transform } from '../utils/coordinates.ts';

export const nodeService = {
  getFloorNodes: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const floor = await prisma.floor.findUnique({
      where: { buildingCode_floorLevel: { buildingCode, floorLevel } },
    });

    if (!floor) {
      throw new Error('Floor not found');
    }

    const nodes = await prisma.node.findMany({
      where: { element: { buildingCode, floorLevel } },
    });

    return transform(
      nodes,
      { latitude: floor.centerLatitude, longitude: floor.centerLongitude },
      floor.scale,
      floor.angle
    );
  },
};

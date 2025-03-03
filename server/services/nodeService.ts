import { prisma } from '../index.ts';
import {
  extractBuildingCode,
  extractFloorLevel,
} from '../../shared/utils/floorCodeUtils.ts';
import type { Nodes } from '../../shared/types.ts';
import { geoCoordsToPdfCoords } from '../utils/coordinates.ts';

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

    const dbNodes = await prisma.node.findMany({
      where: { element: { buildingCode, floorLevel } },
    });

    const geoCenter = {
      latitude: floor.centerLatitude,
      longitude: floor.centerLongitude,
    };
    const pdfCenter = { x: floor.centerX, y: floor.centerY };
    const geoCoordsToPdfCoordsHelper = geoCoordsToPdfCoords(
      geoCenter,
      pdfCenter,
      floor.scale,
      floor.angle
    );

    const nodes: Nodes = {};
    for (const node of dbNodes) {
      const position = {
        latitude: node.latitude,
        longitude: node.longitude,
      };
      const pos = geoCoordsToPdfCoordsHelper(position);
      nodes[node.id] = { neighbors: {}, pos, roomId: node.elementId || '' };
    }

    return nodes;
  },
};

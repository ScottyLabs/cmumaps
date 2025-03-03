import { prisma } from '../index.ts';
import {
  extractBuildingCode,
  extractFloorLevel,
} from '../../shared/utils/floorCodeUtils.ts';
import type { ID, NodeInfo, Nodes } from '../../shared/types.ts';
import {
  geoCoordsToPdfCoords,
  pdfCoordsToGeoCoords,
} from '../utils/coordinates.ts';

export const nodeService = {
  getFloorPlacement: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const floor = await prisma.floor.findUnique({
      where: { buildingCode_floorLevel: { buildingCode, floorLevel } },
    });

    if (!floor) {
      throw new Error('Floor not found');
    }

    const geoCenter = {
      latitude: floor.centerLatitude,
      longitude: floor.centerLongitude,
    };
    const pdfCenter = { x: floor.centerX, y: floor.centerY };

    return {
      geoCenter,
      pdfCenter,
      scale: floor.scale,
      angle: floor.angle,
    };
  },

  getFloorNodes: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const dbNodes = await prisma.node.findMany({
      where: { element: { buildingCode, floorLevel } },
    });

    const placement = await nodeService.getFloorPlacement(floorCode);
    const geoCoordsToPdfCoordsHelper = geoCoordsToPdfCoords(placement);

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

  createNode: async (floorCode: string, nodeId: ID, node: NodeInfo) => {
    const { pos, roomId } = node;

    const placement = await nodeService.getFloorPlacement(floorCode);
    const geoCoords = pdfCoordsToGeoCoords(placement)(pos);

    console.log(geoCoords);

    return;

    await prisma.node.create({
      data: {
        id: nodeId,
        latitude: pos.x,
        longitude: pos.y,
        elementId: roomId ?? null,
      },
    });
  },
};

import type { Nodes, Placement } from "../../shared/types.ts";
import {
  extractBuildingCode,
  extractFloorLevel,
} from "../../shared/utils/floorCodeUtils.ts";
import { prisma } from "../index.ts";
import { geoCoordsToPdfCoords } from "../utils/coordinates.ts";

export const floorService = {
  getFloorNodes: async (floorCode: string, placement: Placement) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const dbNodes = await prisma.node.findMany({
      where: {
        OR: [
          // Nodes directly on the floor
          { buildingCode, floorLevel },
          // Nodes on elements on the floor
          { element: { buildingCode, floorLevel } },
        ],
      },
    });

    const geoCoordsToPdfCoordsHelper = geoCoordsToPdfCoords(placement);
    const nodes: Nodes = {};
    for (const node of dbNodes) {
      const position = {
        latitude: node.latitude,
        longitude: node.longitude,
      };
      const pos = geoCoordsToPdfCoordsHelper(position);
      nodes[node.id] = { neighbors: {}, pos, roomId: node.elementId || "" };
    }

    return nodes;
  },

  getFloorPlacement: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const floor = await prisma.floor.findUnique({
      where: { buildingCode_floorLevel: { buildingCode, floorLevel } },
    });

    if (!floor) {
      throw new Error("Floor not found");
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
};

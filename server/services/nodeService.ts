import { prisma } from "../index.ts";
import type { NodeInfo, Placement } from "../../shared/types.ts";
import { pdfCoordsToGeoCoords } from "../utils/coordinates.ts";
import {
  extractBuildingCode,
  extractFloorLevel,
} from "../../shared/utils/floorCodeUtils.ts";

export const nodeService = {
  createNode: async (
    floorCode: string,
    nodeId: string,
    nodeInfo: NodeInfo,
    placement: Placement
  ) => {
    const { pos, roomId } = nodeInfo;
    const geoCoords = pdfCoordsToGeoCoords(placement)(pos);
    const data = { id: nodeId, ...geoCoords };

    // Belongs to an element
    if (roomId) {
      await prisma.node.create({
        data: { ...data, elementId: roomId },
      });
    }
    // Directly associated with the floor (not an element)
    else {
      const buildingCode = extractBuildingCode(floorCode);
      const floorLevel = extractFloorLevel(floorCode);
      await prisma.node.create({
        data: { ...data, buildingCode, floorLevel },
      });
    }
  },

  deleteNode: async (nodeId: string) => {
    await prisma.node.delete({ where: { id: nodeId } });
  },

  updateNode: async (
    floorCode: string,
    nodeId: string,
    nodeInfo: NodeInfo,
    placement: Placement
  ) => {
    const { pos, roomId } = nodeInfo;
    const geoCoords = pdfCoordsToGeoCoords(placement)(pos);
    const data = { id: nodeId, ...geoCoords };

    // Belongs to an element
    if (roomId) {
      await prisma.node.update({
        where: { id: nodeId },
        data: { ...data, elementId: roomId },
      });
    }
    // Directly associated with the floor (not an element)
    else {
      const buildingCode = extractBuildingCode(floorCode);
      const floorLevel = extractFloorLevel(floorCode);
      await prisma.node.update({
        where: { id: nodeId },
        data: { ...data, buildingCode, floorLevel },
      });
    }
  },
};

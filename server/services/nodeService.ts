import { prisma } from "../index.ts";
import type { NodeInfo, Placement } from "../../shared/types.ts";
import { pdfCoordsToGeoCoords } from "../utils/coordinates.ts";
import {
  extractBuildingCode,
  extractFloorLevel,
} from "../../shared/utils/floorCodeUtils.ts";

export const nodeService = {
  upsertNode: async (
    floorCode: string,
    nodeId: string,
    nodeInfo: NodeInfo,
    placement: Placement
  ) => {
    const { pos, roomId } = nodeInfo;
    const geoCoords = pdfCoordsToGeoCoords(placement)(pos);

    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const data = {
      ...geoCoords,
      buildingCode,
      floorLevel,
      ...(roomId ? { roomId } : {}),
    };

    await prisma.node.upsert({
      where: { nodeId },
      create: {
        nodeId,
        ...data,
      },
      update: data,
    });
  },

  deleteNode: async (nodeId: string) => {
    await prisma.node.delete({ where: { nodeId } });
  },
};

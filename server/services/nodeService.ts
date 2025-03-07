import { prisma, websocketService } from "../index.ts";
import type { ID, NodeInfo, Placement } from "../../shared/types.ts";
import { pdfCoordsToGeoCoords } from "../utils/coordinates.ts";
import {
  extractBuildingCode,
  extractFloorLevel,
} from "../../shared/utils/floorCodeUtils.ts";

export const nodeService = {
  createNode: async (
    socketId: string,
    floorCode: string,
    nodeId: ID,
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

    const payload = { nodeId, nodeInfo };
    websocketService.broadcastToFloor(socketId, "create-node", payload);
  },

  deleteNode: async (socketId: string, nodeId: ID) => {
    await prisma.node.delete({ where: { id: nodeId } });
    websocketService.broadcastToFloor(socketId, "delete-node", { nodeId });
  },

  updateNode: async (
    socketId: string,
    floorCode: string,
    nodeId: ID,
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

    const payload = { nodeId, nodeInfo };
    websocketService.broadcastToFloor(socketId, "update-node", payload);
  },
};

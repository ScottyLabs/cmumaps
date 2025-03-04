import { prisma, websocketService } from "../index.ts";
import type { ID, NodeInfo, Nodes, Placement } from "../../shared/types.ts";
import {
  geoCoordsToPdfCoords,
  pdfCoordsToGeoCoords,
} from "../utils/coordinates.ts";
import {
  extractBuildingCode,
  extractFloorLevel,
} from "../../shared/utils/floorCodeUtils.ts";

export const nodeService = {
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
};

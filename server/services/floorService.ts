import type {
  EdgeInfo,
  Graph,
  Placement,
  RoomType,
} from "../../shared/types.ts";
import {
  extractBuildingCode,
  extractFloorLevel,
} from "../../shared/utils/floorCodeUtils.ts";
import { prisma } from "../index.ts";
import { geoCoordsToPdfCoords } from "../utils/coordinates.ts";

export const floorService = {
  getFloorGraph: async (floorCode: string, placement: Placement) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);
    const geoCoordsToPdfCoordsHelper = geoCoordsToPdfCoords(placement);

    // Get all nodes on the floor with their neighbors
    const dbNodes = await prisma.node.findMany({
      where: {
        OR: [
          // Nodes directly on the floor
          { buildingCode, floorLevel },
          // Nodes on elements on the floor
          { element: { buildingCode, floorLevel } },
        ],
      },
      // include the out floor code of each neighbor
      // include the element of each node (both in and out)
      include: {
        element: {
          select: {
            type: true,
          },
        },
        outEdges: {
          include: {
            outNode: {
              select: {
                buildingCode: true,
                floorLevel: true,
                elementId: true,
                element: {
                  select: {
                    type: true,
                    buildingCode: true,
                    floorLevel: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Convert the nodes to the format expected by the frontend
    const nodes: Graph = {};
    for (const node of dbNodes) {
      // Convert the node's geo position to PDF position
      const position = {
        latitude: node.latitude,
        longitude: node.longitude,
      };
      const pos = geoCoordsToPdfCoordsHelper(position);

      // Create a mapping of neighbor node strings to edge info
      const neighbors: Record<string, EdgeInfo> = {};
      for (const edge of node.outEdges) {
        const outNode = edge.outNode;

        // Determine the target node's floor (either directly or via its element)
        const outBuildingCode =
          outNode.buildingCode || outNode.element?.buildingCode;
        const outFloorLevel = outNode.floorLevel || outNode.element?.floorLevel;
        const outFloorCode = `${outBuildingCode}-${outFloorLevel}`;

        neighbors[edge.outNodeId] = {};
        if (outFloorCode !== floorCode) {
          if (node.element?.type === outNode.element?.type) {
            neighbors[edge.outNodeId].type = node.element?.type as RoomType;
          }
          neighbors[edge.outNodeId].outFloorCode = outFloorCode;
        }
      }

      nodes[node.id] = { pos, neighbors, roomId: node.elementId || "" };
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

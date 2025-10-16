import type {
  EdgeInfo,
  GeoCoordinate,
  GeoNodes,
  GeoRooms,
  Graph,
  Placement,
  Pois,
  PoiType,
  Rooms,
  RoomType,
} from "@cmumaps/common";
import {
  extractBuildingCode,
  extractFloorLevel,
  geoCoordsToPdfCoords,
  geoPolygonToPdfPolygon,
  pdfCoordsToGeoCoords,
  pdfPolygonToGeoPolygon,
} from "@cmumaps/common";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { prisma } from "../../prisma";

export const floorService = {
  getFloorGraph: async (floorCode: string, placement: Placement) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);
    const geoCoordsToPdfCoordsHelper = geoCoordsToPdfCoords(placement);

    // Get all nodes on the floor with their neighbors
    const dbNodes = await prisma.node.findMany({
      where: { buildingCode, floorLevel },
      // include the out floor code of each neighbor
      // include the element of each node (both in and out)
      include: {
        outEdges: {
          include: {
            outNode: {
              select: {
                buildingCode: true,
                floorLevel: true,
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

        // Determine if cross floor edge
        const outFloorCode = `${outNode.buildingCode}-${outNode.floorLevel}`;
        neighbors[edge.outNodeId] = {};
        if (outFloorCode !== floorCode) {
          neighbors[edge.outNodeId].outFloorCode = outFloorCode;
        }
      }

      nodes[node.nodeId] = { pos, neighbors, roomId: node.roomId };
    }

    return nodes;
  },

  getFloorRooms: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const placement = await floorService.getFloorPlacement(floorCode);
    const geoCoordsToPdfCoordsHelper = geoCoordsToPdfCoords(placement);

    // Get all rooms on the floor from the database
    const dbRooms = await prisma.room.findMany({
      where: {
        buildingCode: buildingCode,
        floorLevel: floorLevel,
      },
      include: {
        aliases: true,
      },
    });

    // Convert the rooms to the format expected by the frontend
    const rooms: Rooms = {};
    for (const room of dbRooms) {
      rooms[room.roomId] = {
        name: room.name,
        labelPosition: geoCoordsToPdfCoordsHelper({
          latitude: room.labelLatitude,
          longitude: room.labelLongitude,
        }),
        type: room.type as RoomType,
        displayAlias: room.aliases.filter((a) => a.isDisplayAlias)[0]?.alias,
        aliases: room.aliases.map((a) => a.alias),
        polygon: geoPolygonToPdfPolygon(
          room.polygon as unknown as GeoCoordinate[][],
          placement,
        ),
      };
    }

    return rooms;
  },

  getFloorPois: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const dbPois = await prisma.poi.findMany({
      where: {
        node: {
          buildingCode: buildingCode,
          floorLevel: floorLevel,
        },
      },
    });

    const pois: Pois = {};
    for (const poi of dbPois) {
      pois[poi.poiId] = { type: poi.type as PoiType, nodeId: poi.nodeId };
    }

    return pois;
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

  updateFloorPlacement: async (floorCode: string, placement: Placement) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    await prisma.$transaction(async (tx) => {
      const floor = await tx.floor.findUniqueOrThrow({
        where: { buildingCode_floorLevel: { buildingCode, floorLevel } },
      });

      // get the old placement, which is used to update the nodes and rooms
      const oldPlacement = {
        scale: floor.scale,
        angle: floor.angle,
        geoCenter: {
          latitude: floor.centerLatitude,
          longitude: floor.centerLongitude,
        },
        pdfCenter: { x: floor.centerX, y: floor.centerY },
      };

      // update the floor placement
      await tx.floor.update({
        where: { buildingCode_floorLevel: { buildingCode, floorLevel } },
        data: {
          centerLatitude: placement.geoCenter.latitude,
          centerLongitude: placement.geoCenter.longitude,
          centerX: placement.pdfCenter.x,
          centerY: placement.pdfCenter.y,
          scale: placement.scale,
          angle: placement.angle,
        },
      });

      // update all the nodes on the floor
      const nodes = await tx.node.findMany({
        where: { buildingCode, floorLevel },
      });

      for (const node of nodes) {
        const pos = { latitude: node.latitude, longitude: node.longitude };
        const pdfCoords = geoCoordsToPdfCoords(oldPlacement)(pos);
        const geoCoords = pdfCoordsToGeoCoords(placement)(pdfCoords);
        await tx.node.update({
          where: { nodeId: node.nodeId },
          data: {
            latitude: geoCoords.latitude,
            longitude: geoCoords.longitude,
          },
        });
      }

      // update all the rooms on the floor
      const rooms = await tx.room.findMany({
        where: { buildingCode, floorLevel },
      });

      for (const room of rooms) {
        const labelPos = {
          latitude: room.labelLatitude,
          longitude: room.labelLongitude,
        };
        const pdfCoords = geoCoordsToPdfCoords(oldPlacement)(labelPos);
        const geoCoords = pdfCoordsToGeoCoords(placement)(pdfCoords);

        const polygon = room.polygon as unknown as GeoCoordinate[][];
        const pdfPolygon = geoPolygonToPdfPolygon(polygon, oldPlacement);
        const geoPolygon = pdfPolygonToGeoPolygon(pdfPolygon, placement);
        await tx.room.update({
          where: { roomId: room.roomId },
          data: {
            labelLatitude: geoCoords.latitude,
            labelLongitude: geoCoords.longitude,
            polygon: geoPolygon as unknown as InputJsonValue,
          },
        });
      }
    });
  },

  getFloorplan: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    // Get all rooms on the floor from the database
    const dbRooms = await prisma.room.findMany({
      where: {
        buildingCode: buildingCode,
        floorLevel: floorLevel,
      },
      include: {
        aliases: true,
      },
    });

    // Convert the rooms to the format expected by the frontend
    const rooms: GeoRooms = {};
    for (const room of dbRooms) {
      rooms[room.name] = {
        labelPosition: {
          latitude: room.labelLatitude,
          longitude: room.labelLongitude,
        },
        floor: { buildingCode, level: floorLevel },
        type: room.type as RoomType,
        id: room.roomId,
        alias: room.aliases.filter((a) => a.isDisplayAlias)[0]?.alias,
        points: room.polygon as unknown as GeoCoordinate[][],
      };
    }

    return rooms;
  },

  getFloorNodes: async (floorCode: string) => {
    let buildingCode: string | null = extractBuildingCode(floorCode);
    let floorLevel: string | null = extractFloorLevel(floorCode);

    if (floorCode === "outside") {
      buildingCode = null;
      floorLevel = null;
    }

    // Get all nodes on the floor with their neighbors
    const dbNodes = await prisma.node.findMany({
      where: { buildingCode, floorLevel },
      // include the out floor code of each neighbor
      // include the element of each node (both in and out)
      include: {
        outEdges: {
          include: {
            outNode: {
              select: {
                buildingCode: true,
                floorLevel: true,
              },
            },
          },
        },
      },
    });

    // Convert thGeoNodeses to the format expected by the frontend
    const nodes: GeoNodes = {};
    for (const node of dbNodes) {
      // Convert the node's geo position to PDF position
      const pos = {
        latitude: node.latitude,
        longitude: node.longitude,
      };

      // Create a mapping of neighbor node strings to edge info
      const neighbors: Record<string, EdgeInfo> = {};
      for (const edge of node.outEdges) {
        const outNode = edge.outNode;

        // Determine if cross floor edge
        const outFloorCode = `${outNode.buildingCode}-${outNode.floorLevel}`;
        neighbors[edge.outNodeId] = {};
        if (outFloorCode !== floorCode) {
          neighbors[edge.outNodeId].outFloorCode = outFloorCode;
        }
      }

      nodes[node.nodeId] = { pos, neighbors, roomId: node.roomId };
    }

    return nodes;
  },
};

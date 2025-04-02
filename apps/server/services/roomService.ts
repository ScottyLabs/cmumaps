import {
  Placement,
  RoomInfo,
  extractBuildingCode,
  extractFloorLevel,
} from "@cmumaps/common";

import { prisma } from "@cmumaps/db";

import {
  pdfCoordsToGeoCoords,
  pdfPolygonToGeoPolygon,
} from "../utils/coordinates";

export const roomService = {
  createRoom: async (
    floorCode: string,
    roomId: string,
    roomNodes: string[],
    roomInfo: RoomInfo,
    placement: Placement,
  ) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const { labelPosition, polygon } = roomInfo;
    const geoCoords = pdfCoordsToGeoCoords(placement)(labelPosition);
    const geoPolygon = pdfPolygonToGeoPolygon(polygon, placement);

    // also need to add room id to every node in this room
    await prisma.$transaction(async (tx) => {
      await prisma.room.create({
        data: {
          roomId,
          type: roomInfo.type,
          buildingCode,
          floorLevel,
          name: roomInfo.name,
          labelLatitude: geoCoords.latitude,
          labelLongitude: geoCoords.longitude,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          polygon: geoPolygon as any,
        },
      });

      for (const nodeId of roomNodes) {
        await tx.node.update({
          where: { nodeId },
          data: { roomId },
        });
      }
    });
  },

  deleteRoom: async (roomId: string) => {
    await prisma.$transaction(async (tx) => {
      await tx.room.delete({
        where: { roomId },
      });
    });
  },

  updateRoom: async (
    roomId: string,
    roomInfo: Partial<RoomInfo>,
    placement: Placement,
  ) => {
    const { labelPosition, polygon } = roomInfo;
    const geoCoords = labelPosition
      ? pdfCoordsToGeoCoords(placement)(labelPosition)
      : undefined;

    const geoPolygon = polygon
      ? pdfPolygonToGeoPolygon(polygon, placement)
      : undefined;

    const data = {
      name: roomInfo.name,
      labelLatitude: geoCoords?.latitude,
      labelLongitude: geoCoords?.longitude,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      polygon: geoPolygon as any,
    };

    await prisma.room.update({
      where: { roomId },
      data,
    });
  },
};

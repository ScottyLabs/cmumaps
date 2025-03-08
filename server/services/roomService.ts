import type { InputJsonValue } from "@prisma/client/runtime/library.d.ts";
import { prisma } from "../index.ts";
import type { Placement, RoomInfo } from "../../shared/types.ts";
import {
  extractBuildingCode,
  extractFloorLevel,
} from "../../shared/utils/floorCodeUtils.ts";
import {
  pdfCoordsToGeoCoords,
  pdfPolygonToGeoPolygon,
} from "../utils/coordinates.ts";

export const roomService = {
  createRoom: async (
    floorCode: string,
    elementId: string,
    roomInfo: RoomInfo,
    placement: Placement
  ) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const { labelPosition, polygon } = roomInfo;
    const geoCoords = pdfCoordsToGeoCoords(placement)(labelPosition);
    const geoPolygon = pdfPolygonToGeoPolygon(polygon, placement);
    const data = {
      name: roomInfo.name,
      labelLatitude: geoCoords.latitude,
      labelLongitude: geoCoords.longitude,
      polygon: geoPolygon as unknown as InputJsonValue,
    };

    await prisma.element.create({
      data: {
        elementId,
        type: "room",
        buildingCode,
        floorLevel,
        room: {
          create: data,
        },
      },
    });
  },

  deleteRoom: async (elementId: string) => {
    await prisma.element.delete({
      where: { elementId },
      include: { room: true },
    });
  },

  updateRoom: async (
    elementId: string,
    roomInfo: Partial<RoomInfo>,
    placement: Placement
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
      polygon: geoPolygon as unknown as InputJsonValue,
    };

    await prisma.room.update({
      where: { elementId },
      data,
    });
  },
};

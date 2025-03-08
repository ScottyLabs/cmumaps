import { booleanPointInPolygon } from "@turf/turf";

import { PdfCoordinate, RoomInfo, Polygon } from "../../../shared/types";

export const posToRoomId = (
  point: PdfCoordinate,
  rooms: Record<string, RoomInfo>,
): string | null => {
  let resRoomId = "";

  for (const roomId in rooms) {
    const polygon: Polygon = rooms[roomId].polygon;

    if (polygon) {
      // booleanPointInPolygon breaks when there is an empty polygon or hole...
      if (polygon.coordinates[0].length == 0) {
        continue;
      }

      const polygonCopy = JSON.parse(JSON.stringify(polygon));
      for (let i = polygon.coordinates.length - 1; i >= 0; i--) {
        if (polygon.coordinates[i].length == 0) {
          polygonCopy.coordinates.splice(i, 1);
        }
      }

      if (booleanPointInPolygon([point.x, point.y], polygonCopy)) {
        resRoomId = roomId;
      }
    }
  }

  return resRoomId || null;
};

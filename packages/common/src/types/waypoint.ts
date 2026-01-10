import type { GeoCoordinate } from "./coordTypes.ts";

export type WayPoint =
  | {
      type: "Room";
      roomId: string;
    }
  | {
      type: "Coordinate";
      coordinate: GeoCoordinate;
    }
  | {
      type: "Building";
      buildingCode: string;
    };

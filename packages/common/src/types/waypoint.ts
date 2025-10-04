import type { GeoCoordinate } from "./coordTypes";

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

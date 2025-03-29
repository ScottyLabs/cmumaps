import { GeoCoordinate } from "./coordTypes";
import { RoomInfo } from "./roomTypes";

export type GeoRoom = Omit<RoomInfo, "labelPosition" | "polygon"> & {
  labelPosition: GeoCoordinate;
  points: GeoCoordinate[][];
};

export type GeoRooms = Record<string, GeoRoom>;

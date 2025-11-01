export type SearchIndex = Record<string, [string, number][]>;

import type { Floor, GeoCoordinate, RoomType } from "@cmumaps/common";

export type RoomDocument = {
  id: string;
  nameWithSpace: string;
  fullNameWithSpace: string;
  labelPosition: GeoCoordinate | null;
  type: "room" | "building";
  alias: string;
  numTerms: number;
};

export type Document = RoomDocument;

export type FloorPlans = Record<string, BuildingPlan>;
export type BuildingPlan = Record<string, RoomPlan>;
export type RoomPlan = Record<string, Room>;

export type Room = {
  name: string;
  labelPosition: GeoCoordinate;
  type: RoomType;
  id: string;
  floor: Floor;
  alias: string[];
};

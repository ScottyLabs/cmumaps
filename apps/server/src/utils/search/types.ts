export type SearchIndex = Record<string, [string, number][]>;

import type { Floor, GeoCoordinate, RoomType } from "@cmumaps/common";

export type RoomDocument = {
  id: string;
  name_with_space: string;
  full_name_with_space: string;
  label_position: GeoCoordinate | null;
  _type: "room";
  alias: string;
  num_terms: number;
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

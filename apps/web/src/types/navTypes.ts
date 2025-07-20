import type { Floor } from "@cmumaps/common";
import type { Coordinate } from "mapkit-react";

export type Edge = {
  dist: number;
  toFloorInfo: { toFloor: string; type: string };
};

export type Node = {
  pos: { x: number; y: number };
  neighbors: {
    [neighborId: string]: Edge;
  };
  roomId: string;
  floor: Floor;
  coordinate: Coordinate;
  id: string;
};

export type Instruction = { action: string; distance: number; node_id: string };

export type NavPath = {
  instructions: Instruction[];
  path: { path: Node[]; distance: number };
};

export type NavPaths = {
  Fastest?: NavPath;
  Accessible?: NavPath;
  Inside?: NavPath;
  Outside?: NavPath;
};

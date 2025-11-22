import type { GeoCoordinate, PdfCoordinate } from "./coordTypes";
import type { FloorInfo } from "./floorTypes";

export const ValidCrossFloorEdgeTypes = [
  "Ramp",
  "Stairs",
  "Elevator",
  "", // not assigned
];

export type EdgeType = (typeof ValidCrossFloorEdgeTypes)[number];

export interface EdgeInfo {
  outFloorCode?: string;
}

export interface NodeInfo {
  /**
   * the position (x and y coordinates) of the node
   */
  pos: PdfCoordinate;

  /**
   * (neighbor's id to the edge) for each neighbor of the node
   */
  neighbors: Record<string, EdgeInfo>;

  /**
   * A node belongs to a room if it is inside the room
   * If null, the node is not associated with any room
   */
  roomId: string | null;
}

export interface GeoNode {
  /**
   * the position (x and y coordinates) of the node
   */
  pos: GeoCoordinate;

  /**
   * (neighbor's id to the edge) for each neighbor of the node
   */
  neighbors: Record<string, EdgeInfo>;

  /**
   * A node belongs to a room if it is inside the room
   * If null, the node is not associated with any room
   */
  roomId: string | null;
  floor?: FloorInfo;
  id: string;
}

export interface NavPathNode {
  pos: { x: number; y: number };
  neighbors: {
    [neighborId: string]: EdgeInfo;
  };
  roomId: string;
  floor?: FloorInfo;
  coordinate: GeoCoordinate;
  id: string;
}

export interface GraphPath {
  path: string[];
  addCost: string;
}

export interface Route {
  path: GraphPath;
  distance: number;
}

export interface Instruction {
  action: string;
  distance: number;
  node_id: string;
}

export interface NodesRoute {
  path: NavPathNode[];
  distance: number;
}

export interface PreciseRoute {
  path: NodesRoute;
  instructions: Instruction[];
}

export type Graph = Record<string, NodeInfo>;
export type GeoNodes = Record<string, GeoNode>;
export type Mst = Record<string, Record<string, boolean>>;

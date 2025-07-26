import type { GeoCoordinate, PdfCoordinate } from "./coordTypes";

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
}

export type Graph = Record<string, NodeInfo>;
export type GeoNodes = Record<string, GeoNode>;
export type Mst = Record<string, Record<string, boolean>>;

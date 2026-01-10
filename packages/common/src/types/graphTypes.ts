import type { GeoCoordinate, PdfCoordinate } from "./coordTypes.ts";
import type { Floor, FloorInfo } from "./floorTypes.ts";

export const ValidCrossFloorEdgeTypes = [
  "Ramp",
  "Stairs",
  "Elevator",
  "", // not assigned
];

export type EdgeType = (typeof ValidCrossFloorEdgeTypes)[number];

export interface EdgeInfo {
  outFloorCode?: string;
  dist?: number;
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
  neighbors: {
    [neighborId: string]: EdgeInfo;
  };
  roomId: string;
  floor?: Floor;
  coordinate: GeoCoordinate;
  id: string;
}

/**
 * Represents a path through the navigation graph with associated cost information.
 */
export interface GraphPath {
  /** Ordered list of node IDs forming the path */
  path: string[];
  /** Additional cost factor for the path (e.g., floor changes, accessibility) */
  addCost: string;
}

/**
 * A route with its associated distance.
 */
export interface Route {
  /** The graph path for this route */
  path: GraphPath;
  /** Total distance of the route in meters */
  distance: number;
}

/**
 * A single navigation instruction for turn-by-turn directions.
 */
export interface Instruction {
  /** The action to take (e.g., "Turn left", "Go straight", "Arrive") */
  action: string;
  /** Distance to travel before this instruction in meters */
  distance: number;
  /** The node ID where this instruction applies */
  nodeId: string;
}

/**
 * A route represented as a sequence of navigation nodes.
 */
export interface NodesRoute {
  /** Ordered list of nodes forming the path */
  path: NavPathNode[];
  /** Total distance of the route in meters */
  distance: number;
}

/**
 * A complete route with both path information and turn-by-turn instructions.
 */
export interface PreciseRoute {
  /** The route as a sequence of nodes */
  path: NodesRoute;
  /** Turn-by-turn navigation instructions */
  instructions: Instruction[];
}

export type Graph = Record<string, NodeInfo>;
export type GeoNodes = Record<string, GeoNode>;
export type Mst = Record<string, Record<string, boolean>>;

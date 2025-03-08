import type { Polygon } from "geojson";

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface PdfCoordinate {
  x: number;
  y: number;
}

/**
 * Edge Types
 */
export const ValidCrossFloorEdgeTypes = [
  "ramp",
  "stairs",
  "elevator",
  "", // not assigned
];

export type EdgeType = (typeof ValidCrossFloorEdgeTypes)[number];

/**
 * Graph types
 */
export interface EdgeInfo {
  outFloorCode?: string;
  type?: RoomType;
}

/**
 * Graph types
 */
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
   * the string of the Room the node belongs to
   * ${buildingCode}-${roomName}
   */
  roomId: string;
}

/**
 * Door type
 */
export interface DoorInfo {
  /**
   * list of lines that outlines the door
   */
  lineList: number[][];

  /**
   * center of the door points
   */
  center: PdfCoordinate;

  /**
   * the id of the rooms this door connects
   */
  roomIds: string[];
}

/**
 * Room types
 */
export const RoomTypeList = [
  "Default",
  "Corridor",
  "Auditorium",
  "Office",
  "Classroom",
  "Operational", // Used for storage or maintenance, not publicly accessible
  "Conference",
  "Study",
  "Laboratory",
  "Computer Lab",
  "Studio",
  "Workshop",
  "Vestibule",
  "Storage",
  "Restroom",
  "Stairs",
  "Elevator",
  "Ramp",
  "Dining",
  "Food",
  "Store",
  "Library",
  "Sport",
  "Parking",
  "Inaccessible",
  "", // not assigned
] as const;

export type RoomType = (typeof RoomTypeList)[number];

export const WalkwayTypeList = ["Corridor", "Ramp", "Library"];

export interface RoomInfo {
  /**
   * The short name of the room, without the building name but including the
   * floor level (e.g. '121' for CUC 121)
   */
  name: string;

  /**
   * The coordinates of the label of the room
   */
  labelPosition: PdfCoordinate;

  /**
   * The type of the room
   */
  type: RoomType;

  /**
   * The name under which the room is known (e.g. 'McConomy Auditorium')
   * The one that will be displayed.
   */
  displayAlias?: string;

  /**
   * List of names under which the room is known (e.g. 'McConomy Auditorium')
   * Used for searching
   */
  aliases: string[];

  /**
   * Geojson polygon that outlines the room
   */
  polygon: Polygon;

  /**
   * Most recent update timestamp as a string value in ISO format.
   */
  updatedAt: string;
}

export type Rooms = Record<string, RoomInfo>;
export type Graph = Record<string, NodeInfo>;

export type Mst = Record<string, Record<string, boolean>>;

export interface Placement {
  geoCenter: GeoCoordinate;
  pdfCenter: PdfCoordinate;
  scale: number;
  angle: number;
}

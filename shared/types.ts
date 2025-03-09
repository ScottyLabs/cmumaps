import type { Polygon } from "geojson";

export * from "geojson";

//#region Coordinate types
export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface PdfCoordinate {
  x: number;
  y: number;
}

export interface Placement {
  geoCenter: GeoCoordinate;
  pdfCenter: PdfCoordinate;
  scale: number;
  angle: number;
}
//#endregion

//#region Graph types
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
//#endregion

//#region Room types
export const RoomTypes = [
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

export type RoomType = (typeof RoomTypes)[number];

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
}
//#endregion

//#region POI types
export const PoiTypes = [
  "Vending Machine",
  "Water Fountain",
  "Printer",
  "",
] as const;
export type PoiType = (typeof PoiTypes)[number];
export interface PoiInfo {
  /**
   * The type of the POI
   */
  type: PoiType;

  /**
   * The node id that the POI is associated with
   */
  nodeId: string;
}
//#endregion

// Floor data types
export type Rooms = Record<string, RoomInfo>;
export type Graph = Record<string, NodeInfo>;
export type Pois = Record<string, PoiInfo>;

/**
 * Misc types
 */
export type Mst = Record<string, Record<string, boolean>>;

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

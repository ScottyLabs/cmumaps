import type { PdfCoordinate } from "./coordTypes";
import type { Polygon } from "./geojson";

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

export type Rooms = Record<string, RoomInfo>;

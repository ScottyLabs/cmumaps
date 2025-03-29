import { GeoCoordinate } from "./coordTypes";
import { RoomType } from "./roomTypes";

export interface GeoRoom {
  /**
   * The coordinates of the label of the room
   */
  labelPosition: GeoCoordinate;

  /**
   * The type of the room
   */
  type: RoomType;

  /**
   * The name under which the room is known (e.g. 'McConomy Auditorium')
   * The one that will be displayed.
   */
  alias?: string;

  /**
   * Points to display on map
   */
  points: GeoCoordinate[][];
}

// maps from name to room
export type GeoRooms = Record<string, GeoRoom>;

import { GeoCoordinate } from "./coordTypes";
import { RoomInfo, RoomType } from "./roomTypes";

export interface GeoRoom {
  /**
   * The short name of the room, without the building name but including the
   * floor level (e.g. '121' for CUC 121)
   */
  name: string;

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

export type GeoRooms = Record<string, GeoRoom>;

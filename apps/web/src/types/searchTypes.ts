import { Floor, RoomType } from "@cmumaps/common";
import { Coordinate } from "mapkit-react";

export interface Document {
  /**
   * Unique ID (UUID)
   */
  id: string;

  /**
   * The short name of the room, without the building name but including the
   * floor level (e.g. '121' for CUC 121)
   */
  nameWithSpace: string;
  fullNameWithSpace: string;

  alias: string;

  type: RoomType | "Building";

  labelPosition: Coordinate;

  floor: Floor;
}

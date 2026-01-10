import type { PdfCoordinate } from "./coordTypes.ts";

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

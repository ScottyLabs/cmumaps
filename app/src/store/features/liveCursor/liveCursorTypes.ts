import { ID, PdfCoordinate } from "../../../../../shared/types";

interface BaseCursorInfo {
  cursorPos: PdfCoordinate;
}

export interface CursorInfoOnDragNode extends BaseCursorInfo {
  nodeId: ID;
  nodePos: PdfCoordinate;
}

interface CursorInfoOnDragVertex extends BaseCursorInfo {
  roomId: ID;
  holeIndex: number;
  vertexIndex: number;
  vertexPos: PdfCoordinate;
  cursorPos: PdfCoordinate;
}

type CursorInfoOnMove = BaseCursorInfo;

export type CursorInfo =
  | CursorInfoOnDragNode
  | CursorInfoOnDragVertex
  | CursorInfoOnMove;

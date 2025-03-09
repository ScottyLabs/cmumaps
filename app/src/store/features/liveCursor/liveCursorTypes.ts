import { PdfCoordinate } from "../../../../../shared/types";

interface BaseCursorInfo {
  cursorPos: PdfCoordinate;
}

export interface CursorInfoOnDragNode extends BaseCursorInfo {
  nodeId: string;
  nodePos: PdfCoordinate;
}

export interface DragVertexInfo {
  roomId: string;
  ringIndex: number;
  vertexIndex: number;
  vertexPos: PdfCoordinate;
}

export interface CursorInfoOnDragVertex extends BaseCursorInfo {
  dragVertexInfo: DragVertexInfo;
}

type CursorInfoOnMove = BaseCursorInfo;

export type CursorInfo =
  | CursorInfoOnDragNode
  | CursorInfoOnDragVertex
  | CursorInfoOnMove;

import { PdfCoordinate, Position } from "@cmumaps/shared";

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
  vertexPos: Position;
}

export interface CursorInfoOnDragVertex extends BaseCursorInfo {
  dragVertexInfo: DragVertexInfo;
}

type CursorInfoOnMove = BaseCursorInfo;

export type CursorInfo =
  | CursorInfoOnDragNode
  | CursorInfoOnDragVertex
  | CursorInfoOnMove;

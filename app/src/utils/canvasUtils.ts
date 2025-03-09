import { PdfCoordinate } from "@cmumaps/shared";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import { toast } from "react-toastify";

export const setCursor = (e: KonvaEventObject<MouseEvent>, cursor: string) => {
  const curStage = e.target.getStage();
  if (curStage != null) {
    const container = curStage.container();
    container.style.cursor = cursor;
  }
};

/**
 * @param e Konva event
 * @param offset
 * @param scale
 * @returns the cursor position (relative?, absolute?, need to figure out?)
 */
export const getCursorPos = (
  e: Konva.KonvaEventObject<MouseEvent>,
  offset: PdfCoordinate,
  scale: number,
  callback: (pos: PdfCoordinate) => void,
) => {
  const pos = e.target.getStage()?.getPointerPosition();
  if (!pos) {
    toast.error("Unable to get cursor position!");
    return;
  }
  callback({
    x: Number(((pos.x - offset.x) / scale).toFixed(2)),
    y: Number(((pos.y - offset.y) / scale).toFixed(2)),
  });
};

export const getDragObjectPos = (e: Konva.KonvaEventObject<DragEvent>) => {
  return {
    x: Number(e.target.x().toFixed(2)),
    y: Number(e.target.y().toFixed(2)),
  };
};

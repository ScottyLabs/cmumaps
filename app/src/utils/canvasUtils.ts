import Konva from 'konva';

import { toast } from 'react-toastify';

import { PdfCoordinate } from '../../../shared/types';

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
    toast.error('Unable to get cursor position!');
    return;
  }
  callback({
    x: Number(((pos.x - offset.x) / scale).toFixed(2)),
    y: Number(((pos.y - offset.y) / scale).toFixed(2)),
  });
};

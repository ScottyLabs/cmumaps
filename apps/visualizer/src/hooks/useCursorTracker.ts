import type { PdfCoordinate } from "@cmumaps/common";
import type Konva from "konva";
import { throttle } from "lodash";

import { useEffect } from "react";

import { pushCursorInfo } from "../store/features/liveCursor/liveCursorSlice";
import { syncCursors } from "../store/features/liveCursor/liveCursorThunks";
import { useAppDispatch } from "../store/hooks";
import { getCursorPos } from "../utils/canvasUtils";

export const CURSOR_UPDATE_RATE = 20;
const CURSOR_SYNC_INTERVAL = 500;

const useCursorTracker = (offset: PdfCoordinate, scale: number) => {
  const dispatch = useAppDispatch();

  // store mouse positions
  const handleMouseMove = throttle((e: Konva.KonvaEventObject<MouseEvent>) => {
    getCursorPos(e, offset, scale, (cursorPos) => {
      dispatch(pushCursorInfo({ cursorPos }));
    });
  }, CURSOR_UPDATE_RATE);

  // sync cursor position
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(syncCursors());
    }, CURSOR_SYNC_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  return handleMouseMove;
};

export default useCursorTracker;

import Konva from "konva";
import { throttle } from "lodash";

import { useEffect } from "react";

import { PdfCoordinate } from "../../../shared/types";
import { CURSOR_INTERVAL } from "../components/live-cursors/LiveCursors";
import { pushCursorInfos } from "../store/features/liveCursor/liveCursorSlice";
import { syncCursors } from "../store/features/liveCursor/liveCursorThunks";
import { useAppDispatch } from "../store/hooks";
import { getSocketId } from "../store/middleware/webSocketMiddleware";
import { getCursorPos } from "../utils/canvasUtils";

const useCursorTracker = (offset: PdfCoordinate, scale: number) => {
  const dispatch = useAppDispatch();

  const socketId = getSocketId();

  // store mouse positions
  const handleMouseMove = throttle((e: Konva.KonvaEventObject<MouseEvent>) => {
    getCursorPos(e, offset, scale, (cursorPos) => {
      const socketId = getSocketId();
      if (socketId) {
        dispatch(pushCursorInfos({ socketId, cursorInfo: { cursorPos } }));
      }
    });
  }, CURSOR_INTERVAL);

  // sync cursor position
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(syncCursors());
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, socketId]);

  return handleMouseMove;
};

export default useCursorTracker;

import Konva from "konva";
import { throttle } from "lodash";

import { useEffect, useRef } from "react";

import { PdfCoordinate } from "../../../shared/types";
import { CURSOR_INTERVAL } from "../components/live-cursors/LiveCursors";
import { CursorInfo } from "../store/features/liveCursor/liveCursorSlice";
import { useAppDispatch } from "../store/hooks";
import { getCursorPos } from "../utils/canvasUtils";

const useCursorTracker = (offset: PdfCoordinate, scale: number) => {
  const dispatch = useAppDispatch();

  const cursorInfoListRef = useRef<CursorInfo[]>([]);

  // store mouse positions
  const handleMouseMove = throttle((e: Konva.KonvaEventObject<MouseEvent>) => {
    getCursorPos(e, offset, scale, (cursorPos) => {
      cursorInfoListRef.current.push({ cursorPos });
    });
  }, CURSOR_INTERVAL);

  // sync cursor position
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cursorInfoListRef.current.length > 0) {
        console.log(cursorInfoListRef.current);
        cursorInfoListRef.current = [];
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  return handleMouseMove;
};

export default useCursorTracker;

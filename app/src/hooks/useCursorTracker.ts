import Konva from "konva";
import { throttle } from "lodash";

import { useEffect } from "react";

import { PdfCoordinate } from "../../../shared/types";
import { CURSOR_INTERVAL } from "../components/live-cursors/LiveCursors";
import { SHOW_SELF_CURSOR } from "../settings";
import {
  addUser,
  pushCursorInfoList,
  selectCursorInfoList,
  setCursorInfoList,
} from "../store/features/liveCursor/liveCursorSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getSocketId } from "../store/middleware/webSocketMiddleware";
import { getCursorPos } from "../utils/canvasUtils";

const useCursorTracker = (offset: PdfCoordinate, scale: number) => {
  const dispatch = useAppDispatch();
  const socketId = getSocketId();
  const cursorInfoList = useAppSelector((state) =>
    selectCursorInfoList(state, socketId),
  );

  // optional show self cursor mostly for local testing
  useEffect(() => {
    if (SHOW_SELF_CURSOR && socketId) {
      dispatch(addUser({ userName: "Me", color: "blue", socketId }));
    }
  }, [dispatch, socketId]);

  // store mouse positions
  const handleMouseMove = throttle((e: Konva.KonvaEventObject<MouseEvent>) => {
    getCursorPos(e, offset, scale, (cursorPos) => {
      const socketId = getSocketId();
      if (socketId) {
        dispatch(pushCursorInfoList({ socketId, cursorInfo: { cursorPos } }));
      }
    });
  }, CURSOR_INTERVAL);

  // sync cursor position
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cursorInfoList && cursorInfoList.length > 0) {
        if (socketId) {
          dispatch(setCursorInfoList({ socketId, cursorInfoList: [] }));
        }
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [cursorInfoList, dispatch, socketId]);

  return handleMouseMove;
};

export default useCursorTracker;

import { broadcastWebSocket } from "../../middleware/webSocketActions";
import { getSocketId } from "../../middleware/webSocketMiddleware";
import { AppDispatch, RootState } from "../../store";
import { setCursorInfos } from "./liveCursorSlice";

export const syncCursors =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const socketId = getSocketId();
    if (!socketId) {
      return;
    }

    const cursorInfos = getState().liveCursor.liveCursors[socketId];
    if (cursorInfos && cursorInfos.length > 0) {
      const event = "sync-cursors";
      const payload = { socketId, cursorInfos };
      dispatch(broadcastWebSocket({ event, payload }));
      dispatch(setCursorInfos({ socketId, cursorInfos: [] }));
    }
  };

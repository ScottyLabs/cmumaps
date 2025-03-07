import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LiveUser } from "../../../../../shared/webSocketTypes";
import { CursorInfo } from "./liveCursorTypes";

interface LiveCursorState {
  liveUsers: Record<string, LiveUser>;
  liveCursors: Record<string, CursorInfo[]>;
}

const initialState: LiveCursorState = {
  liveUsers: {},
  liveCursors: {},
};

interface pushCursorInfoPayload {
  socketId: string;
  cursorInfo: CursorInfo;
}
interface SetCursorInfosPayload {
  socketId: string;
  cursorInfos: CursorInfo[];
}

const liveCursorSlice = createSlice({
  name: "liveCursor",
  initialState,
  reducers: {
    setLiveUsers(state, action: PayloadAction<Record<string, LiveUser>>) {
      state.liveUsers = action.payload;
    },

    pushCursorInfo(state, action: PayloadAction<pushCursorInfoPayload>) {
      const { socketId, cursorInfo } = action.payload;
      if (!state.liveCursors[socketId]) {
        state.liveCursors[socketId] = [];
      }
      state.liveCursors[socketId].push(cursorInfo);
    },
    setCursorInfos(state, action: PayloadAction<SetCursorInfosPayload>) {
      state.liveCursors[action.payload.socketId] = action.payload.cursorInfos;
    },
  },
  selectors: {
    selectCursorInfos(state, socketId: string | undefined) {
      if (!socketId) {
        return null;
      }
      return state.liveCursors[socketId];
    },
  },
});

export const { selectCursorInfos } = liveCursorSlice.selectors;
export const { setLiveUsers, pushCursorInfo, setCursorInfos } =
  liveCursorSlice.actions;
export default liveCursorSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CursorInfo } from "./liveCursorTypes";

export const CURSOR_INTERVAL = 20;

export interface User {
  userName: string;
  color: string;
  socketId: string;
}

interface LiveCursorState {
  users: Record<string, User>;
  liveCursors: Record<string, CursorInfo[]>;
}

const initialState: LiveCursorState = {
  users: {},
  liveCursors: {},
};

interface pushCursorInfoPayload {
  socketId: string;
  cursorInfo: CursorInfo;
}
interface SetCursorInfoListPayload {
  socketId: string;
  cursorInfoList: CursorInfo[];
}

const liveCursorSlice = createSlice({
  name: "liveCursor",
  initialState,
  reducers: {
    pushCursorInfoList(state, action: PayloadAction<pushCursorInfoPayload>) {
      const { socketId, cursorInfo } = action.payload;
      if (!state.liveCursors[socketId]) {
        state.liveCursors[socketId] = [];
      }
      state.liveCursors[socketId].push(cursorInfo);
    },
    setCursorInfoList(state, action: PayloadAction<SetCursorInfoListPayload>) {
      state.liveCursors[action.payload.socketId] =
        action.payload.cursorInfoList;
    },
  },
  selectors: {
    selectCursorInfoList(state, socketId: string | undefined) {
      if (!socketId) {
        return [];
      }
      return state.liveCursors[socketId];
    },
  },
});

export const { selectCursorInfoList } = liveCursorSlice.selectors;
export const { pushCursorInfoList, setCursorInfoList } =
  liveCursorSlice.actions;
export default liveCursorSlice.reducer;

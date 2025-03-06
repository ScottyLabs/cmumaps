import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CursorInfo } from "./liveCursorTypes";

export const CURSOR_INTERVAL = 20;

export interface User {
  userName: string;
  color: string;
}

interface LiveCursorState {
  users: Record<string, User>;
  liveCursors: Record<string, CursorInfo[]>;
}

const initialState: LiveCursorState = {
  users: {},
  liveCursors: {},
};

interface UpdateCursorPayload {
  socketId: string;
  cursorInfoList: CursorInfo[];
}

const liveCursorSlice = createSlice({
  name: "liveCursor",
  initialState,
  reducers: {
    updateCursorInfoList(state, action: PayloadAction<UpdateCursorPayload>) {
      state.liveCursors[action.payload.socketId] =
        action.payload.cursorInfoList;
    },
  },
  selectors: {
    selectCursorInfoList(state, socketId: string) {
      return state.liveCursors[socketId];
    },
  },
});

export const { selectCursorInfoList } = liveCursorSlice.selectors;
export const { updateCursorInfoList } = liveCursorSlice.actions;
export default liveCursorSlice.reducer;

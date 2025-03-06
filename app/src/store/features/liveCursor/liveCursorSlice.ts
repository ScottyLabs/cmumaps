import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LiveUser } from "../../../../../shared/webSocketTypes";
import { CursorInfo } from "./liveCursorTypes";

export const CURSOR_INTERVAL = 20;

interface LiveCursorState {
  liveUsers: Record<string, LiveUser>;
  liveCursors: Record<string, CursorInfo[]>;
}

const initialState: LiveCursorState = {
  liveUsers: {},
  liveCursors: {},
};

interface AddUserPayload {
  socketId: string;
  user: LiveUser;
}

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
    addUser(state, action: PayloadAction<AddUserPayload>) {
      const { socketId, user } = action.payload;
      state.liveUsers[socketId] = user;
    },
    removeUser(state, action: PayloadAction<string>) {
      delete state.liveUsers[action.payload];
    },

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
        return null;
      }
      return state.liveCursors[socketId];
    },
  },
});

export const { selectCursorInfoList } = liveCursorSlice.selectors;
export const { addUser, removeUser, pushCursorInfoList, setCursorInfoList } =
  liveCursorSlice.actions;
export default liveCursorSlice.reducer;

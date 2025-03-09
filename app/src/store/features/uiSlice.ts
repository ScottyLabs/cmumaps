import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum InfoDisplayTabIndex {
  ROOM = 0,
  POI = 1,
  NODE = 2,
}

interface UIState {
  infoDisplayActiveTabIndex: InfoDisplayTabIndex;
  showRoomSpecific: boolean;
  editRoomLabel: boolean;
  nodeSize: number;
}

const initialState: UIState = {
  infoDisplayActiveTabIndex: InfoDisplayTabIndex.ROOM,
  showRoomSpecific: false,
  editRoomLabel: false,
  nodeSize: 2,
};

const UISlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setInfoDisplayActiveTabIndex(state, action: PayloadAction<number>) {
      state.infoDisplayActiveTabIndex = action.payload;
    },

    setShowRoomSpecific(state, action: PayloadAction<boolean>) {
      state.showRoomSpecific = action.payload;
    },
    toggleShowRoomSpecific(state) {
      state.showRoomSpecific = !state.showRoomSpecific;
    },

    setEditRoomLabel(state, action: PayloadAction<boolean>) {
      state.editRoomLabel = action.payload;
    },
    toggleEditRoomLabel(state) {
      state.editRoomLabel = !state.editRoomLabel;
    },

    setNodeSize(state, action: PayloadAction<number>) {
      state.nodeSize = action.payload;
    },
  },
});

export const {
  setInfoDisplayActiveTabIndex,
  setShowRoomSpecific,
  toggleShowRoomSpecific,
  setEditRoomLabel,
  toggleEditRoomLabel,
  setNodeSize,
} = UISlice.actions;
export default UISlice.reducer;

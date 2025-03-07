import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PdfCoordinate } from "../../../../shared/types";

interface MouseEventState {
  hoverNodeId: string | null;
  dragNodeId: string | null;
  dragNodePos: PdfCoordinate | null;
}

const initialState: MouseEventState = {
  hoverNodeId: null,
  dragNodeId: null,
  dragNodePos: null,
};

const mouseEventSlice = createSlice({
  name: "mouseEvent",
  initialState,
  reducers: {
    hoverNode(state, action: PayloadAction<string>) {
      state.hoverNodeId = action.payload;
    },
    unHoverNode(state) {
      state.hoverNodeId = null;
    },

    dragNode(state, action: PayloadAction<string>) {
      state.dragNodeId = action.payload;
    },
    releaseNode(state) {
      state.dragNodeId = null;
    },

    setDragNodePos(state, action: PayloadAction<PdfCoordinate>) {
      state.dragNodePos = action.payload;
    },
  },
});

export const { hoverNode, unHoverNode, dragNode, releaseNode, setDragNodePos } =
  mouseEventSlice.actions;
export default mouseEventSlice.reducer;

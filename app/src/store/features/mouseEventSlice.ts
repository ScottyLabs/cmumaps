import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ID, PdfCoordinate } from "../../../../shared/types";

interface MouseEventState {
  hoverNodeId: ID | null;
  dragNodeId: ID | null;
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
    hoverNode(state, action: PayloadAction<ID>) {
      state.hoverNodeId = action.payload;
    },
    unHoverNode(state) {
      state.hoverNodeId = null;
    },

    dragNode(state, action: PayloadAction<ID>) {
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

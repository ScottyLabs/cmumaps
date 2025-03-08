import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PdfCoordinate } from "../../../../shared/types";

interface MouseEventState {
  dragNodeId: string | null;
  dragNodePos: PdfCoordinate | null;
}

const initialState: MouseEventState = {
  dragNodeId: null,
  dragNodePos: null,
};

const mouseEventSlice = createSlice({
  name: "mouseEvent",
  initialState,
  reducers: {
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

export const { dragNode, releaseNode, setDragNodePos } =
  mouseEventSlice.actions;
export default mouseEventSlice.reducer;

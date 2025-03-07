import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ID, PdfCoordinate } from "../../../../shared/types";

export type IdSelectedType = "Node" | "Door" | "None";
export const NODE: IdSelectedType = "Node";
export const DOOR: IdSelectedType = "Door";
export const NONE: IdSelectedType = "None";

export interface IdSelectedInfo {
  id: ID;
  type: IdSelectedType;
}

const DEFAULT: IdSelectedInfo = { id: "", type: NONE };

interface MouseEventState {
  idSelected: IdSelectedInfo;
  nodeIdOnHover: ID | null;
  nodeIdOnDrag: ID | null;
  dragNodePos: PdfCoordinate | null;
}

const initialState: MouseEventState = {
  idSelected: DEFAULT,
  nodeIdOnHover: null,
  nodeIdOnDrag: null,
  dragNodePos: null,
};

const mouseEventSlice = createSlice({
  name: "mouseEvent",
  initialState,
  reducers: {
    selectNode(state, action: PayloadAction<string>) {
      state.idSelected = { id: action.payload, type: NODE };
    },
    selectDoor(state, action: PayloadAction<string>) {
      state.idSelected = { id: action.payload, type: DOOR };
    },
    deselect(state) {
      state.idSelected = DEFAULT;
    },

    hoverNode(state, action: PayloadAction<ID>) {
      state.nodeIdOnHover = action.payload;
    },
    unHoverNode(state) {
      state.nodeIdOnHover = null;
    },

    dragNode(state, action: PayloadAction<ID>) {
      state.nodeIdOnDrag = action.payload;
    },
    releaseNode(state) {
      state.nodeIdOnDrag = null;
    },

    setDragNodePos(state, action: PayloadAction<PdfCoordinate>) {
      state.dragNodePos = action.payload;
    },
  },
});

export const getNodeIdSelected = (state: MouseEventState) => {
  const idSelected = state.idSelected;
  return idSelected.type == NODE ? idSelected.id : null;
};

export const getDoorIdSelected = (state: MouseEventState) => {
  const idSelected = state.idSelected;
  return idSelected.type == DOOR ? idSelected.id : null;
};

export const {
  selectNode,
  selectDoor,
  deselect,
  hoverNode,
  unHoverNode,
  dragNode,
  releaseNode,
  setDragNodePos,
} = mouseEventSlice.actions;
export default mouseEventSlice.reducer;

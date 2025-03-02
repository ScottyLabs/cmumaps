import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PolygonState {
  vertexIndexOnDrag: number | null;
  ringIndex: number;
}

const initialState: PolygonState = {
  vertexIndexOnDrag: null,
  ringIndex: 0,
};

const polygonSlice = createSlice({
  name: "polygon",
  initialState,
  reducers: {
    dragVertex(state, action: PayloadAction<number>) {
      state.vertexIndexOnDrag = action.payload;
    },
    releaseVertex(state) {
      state.vertexIndexOnDrag = null;
    },

    setRingIndex(state, action: PayloadAction<number>) {
      state.ringIndex = action.payload;
    },
  },
});

export const { dragVertex, releaseVertex, setRingIndex } = polygonSlice.actions;
export default polygonSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PolygonState {
  ringIndex: number;
}

const initialState: PolygonState = {
  ringIndex: 0,
};

const polygonSlice = createSlice({
  name: "polygon",
  initialState,
  reducers: {
    setRingIndex(state, action: PayloadAction<number>) {
      state.ringIndex = action.payload;
    },
  },
});

export const { setRingIndex } = polygonSlice.actions;
export default polygonSlice.reducer;

import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface FloorState {
  floorCode: string | null;
  floorLevels: string[] | null;
}

const initialState: FloorState = {
  floorCode: null,
  floorLevels: null,
};

const floorSlice = createSlice({
  name: "floor",
  initialState,
  reducers: {
    setFloorCode(state, action: PayloadAction<string>) {
      state.floorCode = action.payload;
    },
    setFloorLevels(state, action: PayloadAction<string[]>) {
      state.floorLevels = action.payload;
    },
  },
});

export const { setFloorCode, setFloorLevels } = floorSlice.actions;
export default floorSlice.reducer;

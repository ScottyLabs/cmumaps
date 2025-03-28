import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapUiState {
  focusedFloor: string | null;
}

const initialState: MapUiState = {
  focusedFloor: null,
};

const mapUiSlice = createSlice({
  name: "mapUi",
  initialState,
  reducers: {
    focusFloor(state, action: PayloadAction<string>) {
      state.focusedFloor = action.payload;
    },
  },
});

export const { focusFloor } = mapUiSlice.actions;
export default mapUiSlice.reducer;

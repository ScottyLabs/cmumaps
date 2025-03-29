import { Building } from "@cmumaps/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  focusedFloor: string | null;
  selectedBuilding: Building | null;
}

const initialState: MapState = {
  focusedFloor: null,
  selectedBuilding: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    focusFloor(state, action: PayloadAction<string>) {
      state.focusedFloor = action.payload;
    },
    selectBuilding(state, action: PayloadAction<Building>) {
      state.selectedBuilding = action.payload;
    },
    deselectBuilding(state) {
      state.selectedBuilding = null;
    },
  },
});

export const { focusFloor, selectBuilding, deselectBuilding } =
  mapSlice.actions;
export default mapSlice.reducer;

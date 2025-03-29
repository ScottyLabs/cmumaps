import { Building } from "@cmumaps/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapUiState {
  focusedFloor: string | null;
  selectedBuilding: Building | null;
}

const initialState: MapUiState = {
  focusedFloor: null,
  selectedBuilding: null,
};

const mapUiSlice = createSlice({
  name: "mapUi",
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
  mapUiSlice.actions;
export default mapUiSlice.reducer;

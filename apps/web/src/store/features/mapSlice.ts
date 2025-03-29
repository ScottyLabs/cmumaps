import { Building, Floor } from "@cmumaps/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  isZooming: boolean;
  focusedFloor: Floor | null;
  selectedBuilding: Building | null;
}

const initialState: MapState = {
  isZooming: false,
  focusedFloor: null,
  selectedBuilding: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setIsZooming(state, action: PayloadAction<boolean>) {
      state.isZooming = action.payload;
    },
    focusFloor(state, action: PayloadAction<Floor>) {
      state.focusedFloor = action.payload;
    },
    unfocusFloor(state) {
      state.focusedFloor = null;
    },
    selectBuilding(state, action: PayloadAction<Building>) {
      state.selectedBuilding = action.payload;
    },
    deselectBuilding(state) {
      state.selectedBuilding = null;
    },
  },
});

export const {
  focusFloor,
  unfocusFloor,
  selectBuilding,
  deselectBuilding,
  setIsZooming,
} = mapSlice.actions;
export default mapSlice.reducer;

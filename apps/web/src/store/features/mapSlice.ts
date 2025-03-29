import { Building, Floor } from "@cmumaps/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  isZooming: boolean;
  focusedFloor: Floor | null;
  selectedBuilding: Building | null;
  showRoomNames: boolean;
}

const initialState: MapState = {
  isZooming: false,
  focusedFloor: null,
  selectedBuilding: null,
  showRoomNames: false,
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
    setShowRoomNames(state, action: PayloadAction<boolean>) {
      state.showRoomNames = action.payload;
    },
  },
});

export const {
  focusFloor,
  unfocusFloor,
  selectBuilding,
  deselectBuilding,
  setIsZooming,
  setShowRoomNames,
} = mapSlice.actions;
export default mapSlice.reducer;

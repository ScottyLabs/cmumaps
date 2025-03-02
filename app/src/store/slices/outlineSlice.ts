import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DoorInfo, ID } from '../../../../shared/types';

interface OutlineState {
  walls: number[][] | null;
  doors: Record<ID, DoorInfo> | null;
  roomlessDoors: number[][] | null;
}

const initialState: OutlineState = {
  walls: null,
  doors: null,
  roomlessDoors: null,
};

const outlineSlice = createSlice({
  name: 'outline',
  initialState,
  reducers: {
    setOutline(state, action: PayloadAction<OutlineState>) {
      state.walls = action.payload.walls;
      state.doors = action.payload.doors;
      state.roomlessDoors = action.payload.roomlessDoors;
    },

    setDoors(state, action) {
      state.doors = action.payload.doors;
      state.roomlessDoors = action.payload.roomlessDoors;
    },
  },
});

export const { setOutline, setDoors } = outlineSlice.actions;
export default outlineSlice.reducer;

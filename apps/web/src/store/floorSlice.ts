import type { Floor } from "@cmumaps/common";
import type { StateCreator } from "zustand";

export interface FloorSlice {
  focusedFloor: Floor | null;
  focusFloor: (floor: Floor) => void;
  unfocusFloor: () => void;
}

export const createFloorSlice: StateCreator<FloorSlice> = (set) => ({
  focusedFloor: null,
  focusFloor: (floor: Floor) => set({ focusedFloor: floor }),
  unfocusFloor: () => set({ focusedFloor: null }),
});

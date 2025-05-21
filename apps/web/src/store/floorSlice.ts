import { Floor } from "@cmumaps/common";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useFloorStore = create(
  combine({ focusedFloor: null as Floor | null }, (set) => ({
    focusFloor: (floor: Floor) => set({ focusedFloor: floor }),
    unfocusFloor: () => set({ focusedFloor: null }),
  })),
);

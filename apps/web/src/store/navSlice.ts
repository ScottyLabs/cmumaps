import type { StateCreator } from "zustand";

export interface NavSlice {
  isNavigating: boolean;
  startNav: () => void;
  endNav: () => void;
}

export const createNavSlice: StateCreator<NavSlice> = (set) => ({
  isNavigating: false,
  startNav: () => set({ isNavigating: true }),
  endNav: () => set({ isNavigating: false }),
});

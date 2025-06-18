import type { StateCreator } from "zustand";

export interface NavSlice {
  isNavOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
}

export const createNavSlice: StateCreator<NavSlice> = (set) => ({
  isNavOpen: false,
  openNav: () => set({ isNavOpen: true }),
  closeNav: () => set({ isNavOpen: false }),
});

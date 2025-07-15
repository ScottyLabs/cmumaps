import type { StateCreator } from "zustand";
import type { NavPaths } from "@/types/graphTypes";

export interface NavSlice {
  isNavigating: boolean;
  navPaths: NavPaths;
  setNavPaths: (path: Node[]) => void;
  startNav: () => void;
  endNav: () => void;
}

export const createNavSlice: StateCreator<NavSlice> = (set) => ({
  isNavigating: false,
  navPaths: {},
  setNavPaths: (path: NavPaths) => set({ navPaths: path }),
  startNav: () => set({ isNavigating: true }),
  endNav: () => set({ isNavigating: false }),
});

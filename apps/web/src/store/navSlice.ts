import type { StateCreator } from "zustand";
import type { Instruction, NavPaths } from "@/types/navTypes";

export interface NavSlice {
  isNavigating: boolean;
  navPaths: NavPaths;
  navInstructionIndex: number;
  navInstructions?: Instruction[];
  setNavInstructionIndex: (index: number) => void;
  setNavInstructions: (instructions: Instruction[]) => void;
  setNavPaths: (path: Node[]) => void;
  startNav: () => void;
  endNav: () => void;
}

export const createNavSlice: StateCreator<NavSlice> = (set) => ({
  isNavigating: false,
  navPaths: {},
  navInstructionIndex: 0,
  navInstructions: undefined,
  setNavInstructionIndex: (index: number) =>
    set({ navInstructionIndex: index }),
  setNavInstructions: (instructions: Instruction[]) =>
    set({ navInstructions: instructions }),
  setNavPaths: (path: NavPaths) => set({ navPaths: path }),
  startNav: () => set({ isNavigating: true }),
  endNav: () => set({ isNavigating: false, navInstructionIndex: 0 }),
});

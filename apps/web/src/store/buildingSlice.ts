import type { Building } from "@cmumaps/common";
import type { StateCreator } from "zustand";

export interface BuildingSlice {
  selectedBuilding: Building | null;
  selectBuilding: (building: Building) => void;
  deselectBuilding: () => void;
}

export const createBuildingSlice: StateCreator<BuildingSlice> = (set) => ({
  selectedBuilding: null,
  selectBuilding: (building: Building) => set({ selectedBuilding: building }),
  deselectBuilding: () => set({ selectedBuilding: null }),
});

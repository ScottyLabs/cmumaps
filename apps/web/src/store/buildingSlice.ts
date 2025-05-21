import { Building } from "@cmumaps/common";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useBuildingStore = create(
  combine({ selectedBuilding: null as Building | null }, (set) => ({
    selectBuilding: (building: Building) => set({ selectedBuilding: building }),
    deselectBuilding: () => set({ selectedBuilding: null }),
  })),
);

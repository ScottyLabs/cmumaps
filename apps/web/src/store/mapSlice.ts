import { Building, Floor } from "@cmumaps/common";
import { create } from "zustand";

interface MapState {
  // Zooming
  isZooming: boolean;
  setIsZooming: (isZooming: boolean) => void;

  // Room Names
  showRoomNames: boolean;
  setShowRoomNames: (show: boolean) => void;

  // Focused Floor
  focusedFloor: Floor | null;
  focusFloor: (floor: Floor) => void;
  unfocusFloor: () => void;

  // Selected Building
  selectedBuilding: Building | null;
  selectBuilding: (building: Building) => void;
  deselectBuilding: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  // Zooming
  isZooming: false,
  setIsZooming: (isZooming) => set({ isZooming }),

  // Room Names
  showRoomNames: false,
  setShowRoomNames: (show) => set({ showRoomNames: show }),

  // Focused Floor
  focusedFloor: null,
  focusFloor: (floor) => set({ focusedFloor: floor }),
  unfocusFloor: () => set({ focusedFloor: null }),

  // Selected Building
  selectedBuilding: null,
  selectBuilding: (building) => set({ selectedBuilding: building }),
  deselectBuilding: () => set({ selectedBuilding: null }),
}));

export default useMapStore;

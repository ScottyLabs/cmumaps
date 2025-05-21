import { StateCreator } from "zustand";

export interface ZoomSlice {
  isZooming: boolean;
  setIsZooming: (isZooming: boolean) => void;

  showRoomNames: boolean;
  setShowRoomNames: (showRoomNames: boolean) => void;
}

export const createZoomSlice: StateCreator<ZoomSlice> = (set) => ({
  isZooming: false,
  setIsZooming: (isZooming: boolean) => set({ isZooming }),

  showRoomNames: false,
  setShowRoomNames: (showRoomNames: boolean) => set({ showRoomNames }),
});

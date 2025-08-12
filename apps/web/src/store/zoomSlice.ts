import type { StateCreator } from "zustand";

export interface ZoomSlice {
  isZooming: boolean;
  setIsZooming: (isZooming: boolean) => void;

  showRoomNames: boolean;
  setShowRoomNames: (showRoomNames: boolean) => void;

  queuedZoomRegion: mapkit.CoordinateRegion | null;
  setQueuedZoomRegion: (region: mapkit.CoordinateRegion | null) => void;
}

export const createZoomSlice: StateCreator<ZoomSlice> = (set) => ({
  isZooming: false,
  setIsZooming: (isZooming: boolean) => set({ isZooming }),

  showRoomNames: false,
  setShowRoomNames: (showRoomNames: boolean) => set({ showRoomNames }),

  queuedZoomRegion: null,
  setQueuedZoomRegion: (region: mapkit.CoordinateRegion | null) =>
    set({ queuedZoomRegion: region }),
});

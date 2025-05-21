import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useZoomStore = create(
  combine({ isZooming: false }, (set) => ({
    setIsZooming: (isZooming: boolean) => set({ isZooming }),
  })),
);

export const useRoomNamesStore = create(
  combine({ showRoomNames: false }, (set) => ({
    setShowRoomNames: (showRoomNames: boolean) => set({ showRoomNames }),
  })),
);

import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useSearchStore = create(
  combine({ isSearchOpen: false }, (set) => ({
    showSearch: () => set({ isSearchOpen: true }),
    hideSearch: () => set({ isSearchOpen: false }),
  })),
);

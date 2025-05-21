import { StateCreator } from "zustand";

export interface SearchSlice {
  isSearchOpen: boolean;
  showSearch: () => void;
  hideSearch: () => void;
}

export const createSearchSlice: StateCreator<SearchSlice> = (set) => ({
  isSearchOpen: false,
  showSearch: () => set({ isSearchOpen: true }),
  hideSearch: () => set({ isSearchOpen: false }),
});

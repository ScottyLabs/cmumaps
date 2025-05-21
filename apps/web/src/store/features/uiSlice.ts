import { create } from "zustand";

interface UiState {
  isLoginOpen: boolean;
  showLogin: () => void;
  hideLogin: () => void;

  isSearchOpen: boolean;
  showSearch: () => void;
  hideSearch: () => void;
}

const useUiStore = create<UiState>((set) => ({
  isLoginOpen: false,
  showLogin: () => set({ isLoginOpen: true }),
  hideLogin: () => set({ isLoginOpen: false }),

  isSearchOpen: false,
  showSearch: () => set({ isSearchOpen: true }),
  hideSearch: () => set({ isSearchOpen: false }),
}));

export default useUiStore;

import { create } from "zustand";

interface UiState {
  isLoginOpen: boolean;
  isSearchOpen: boolean;
  showLogin: () => void;
  hideLogin: () => void;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const useUiStore = create<UiState>((set) => ({
  isLoginOpen: false,
  isSearchOpen: false,
  showLogin: () => set({ isLoginOpen: true }),
  hideLogin: () => set({ isLoginOpen: false }),
  setIsSearchOpen: (isOpen: boolean) => set({ isSearchOpen: isOpen }),
}));

export default useUiStore;

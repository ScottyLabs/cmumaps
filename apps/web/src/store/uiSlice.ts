import { create } from "zustand";

export const CardStates = {
  COLLAPSED: "collapsed",
  HALF_OPEN: "half-open",
  EXPANDED: "expanded",
} as const;
export const CardStatesList = Object.values(CardStates);
export type CardStatus = (typeof CardStates)[keyof typeof CardStates];

interface UiState {
  // Login
  isLoginOpen: boolean;
  showLogin: () => void;
  hideLogin: () => void;

  // Search Bar
  isSearchOpen: boolean;
  showSearch: () => void;
  hideSearch: () => void;

  // Card Status
  cardStatus: CardStatus;
  setCardStatus: (status: CardStatus) => void;
  isCardCollapsed: () => boolean;
}

const useUiStore = create<UiState>((set, get) => ({
  // Login
  isLoginOpen: false,
  showLogin: () => set({ isLoginOpen: true }),
  hideLogin: () => set({ isLoginOpen: false }),

  // Search Bar
  isSearchOpen: false,
  showSearch: () => set({ isSearchOpen: true }),
  hideSearch: () => set({ isSearchOpen: false }),

  // Card Status
  cardStatus: CardStates.HALF_OPEN,
  setCardStatus: (status) => set({ cardStatus: status }),
  isCardCollapsed: () => get().cardStatus === CardStates.COLLAPSED,
}));

export default useUiStore;

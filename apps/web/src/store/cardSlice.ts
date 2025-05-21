import { StateCreator } from "zustand";

export const CardStates = {
  COLLAPSED: "collapsed",
  HALF_OPEN: "half-open",
  EXPANDED: "expanded",
} as const;
export type CardStatus = (typeof CardStates)[keyof typeof CardStates];
export const CardStatesList = Object.values(CardStates);

export interface CardSlice {
  cardStatus: CardStatus;
  setCardStatus: (status: CardStatus) => void;
  isCardCollapsed: () => boolean;
}

export const createCardSlice: StateCreator<CardSlice> = (set, get) => ({
  cardStatus: CardStates.HALF_OPEN as CardStatus,
  setCardStatus: (status: CardStatus) => set({ cardStatus: status }),
  isCardCollapsed: () => get().cardStatus === CardStates.COLLAPSED,
});

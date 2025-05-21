import { create } from "zustand";
import { combine } from "zustand/middleware";

export const CardStates = {
  COLLAPSED: "collapsed",
  HALF_OPEN: "half-open",
  EXPANDED: "expanded",
} as const;
export type CardStatus = (typeof CardStates)[keyof typeof CardStates];
export const CardStatesList = Object.values(CardStates);

export const useCardStore = create(
  combine({ cardStatus: CardStates.HALF_OPEN as CardStatus }, (set, get) => ({
    setCardStatus: (status: CardStatus) => set({ cardStatus: status }),
    isCardCollapsed: () => get().cardStatus === CardStates.COLLAPSED,
  })),
);

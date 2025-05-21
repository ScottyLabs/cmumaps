import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useLoginStore = create(
  combine({ isLoginOpen: false }, (set) => ({
    showLogin: () => set({ isLoginOpen: true }),
    hideLogin: () => set({ isLoginOpen: false }),
  })),
);

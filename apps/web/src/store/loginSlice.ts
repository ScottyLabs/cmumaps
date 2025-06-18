import type { StateCreator } from "zustand";

export interface LoginSlice {
  isLoginOpen: boolean;
  showLogin: () => void;
  hideLogin: () => void;
}

export const createLoginSlice: StateCreator<LoginSlice> = (set) => ({
  isLoginOpen: false,
  showLogin: () => set({ isLoginOpen: true }),
  hideLogin: () => set({ isLoginOpen: false }),
});

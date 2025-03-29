import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const InfoCardStates = {
  COLLAPSED: "collapsed",
  HALF_OPEN: "half-open",
  EXPANDED: "expanded",
} as const;

export type InfoCardStatus =
  (typeof InfoCardStates)[keyof typeof InfoCardStates];

interface UiState {
  showLogin: boolean;
  isSearchOpen: boolean;
  infoCardStatus: InfoCardStatus;
}

const initialState: UiState = {
  showLogin: false,
  isSearchOpen: false,
  infoCardStatus: InfoCardStates.COLLAPSED,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLogin(state) {
      state.showLogin = true;
    },
    hideLogin(state) {
      state.showLogin = false;
    },
    setIsSearchOpen(state, action: PayloadAction<boolean>) {
      state.isSearchOpen = action.payload;
    },
    setInfoCardStatus(state, action: PayloadAction<InfoCardStatus>) {
      state.infoCardStatus = action.payload;
    },
  },
  selectors: {
    selectCardCollapsed: (state) =>
      state.infoCardStatus === InfoCardStates.COLLAPSED,
  },
});

export const { showLogin, hideLogin, setIsSearchOpen, setInfoCardStatus } =
  uiSlice.actions;
export const { selectCardCollapsed } = uiSlice.selectors;
export default uiSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  showLogin: boolean;
  isSearchOpen: boolean;
}

const initialState: UiState = {
  showLogin: false,
  isSearchOpen: false,
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
  },
});

export const { showLogin, hideLogin, setIsSearchOpen } = uiSlice.actions;
export default uiSlice.reducer;

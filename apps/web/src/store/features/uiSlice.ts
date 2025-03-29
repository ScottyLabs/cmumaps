import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  showLogin: boolean;
}

const initialState: UiState = {
  showLogin: false,
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
  },
});

export const { showLogin } = uiSlice.actions;
export default uiSlice.reducer;

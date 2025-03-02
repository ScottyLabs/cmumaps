import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ErrorCode } from '../../../../shared/errorCode';

export type LoadingStatus = 'Loaded' | 'Loading' | 'Failed';
export const LOADED: LoadingStatus = 'Loaded';
export const LOADING: LoadingStatus = 'Loading';
export const FAILED_LOAD: LoadingStatus = 'Failed';

interface StatusState {
  loadingStatus: LoadingStatus;
  loadingText: string;
  shortcutsDisabled: boolean;
  errorCode: ErrorCode;
}

const initialState: StatusState = {
  loadingStatus: 'Loading',
  loadingText: '',
  shortcutsDisabled: false,
  errorCode: '',
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    startLoading(state, action: PayloadAction<string>) {
      state.loadingStatus = LOADING;
      state.loadingText = action.payload;
    },
    finishLoading(state) {
      state.loadingStatus = LOADED;
      state.loadingText = '';
    },
    failedLoading(state, action: PayloadAction<string>) {
      state.loadingStatus = FAILED_LOAD;
      state.loadingText = action.payload;
    },

    setShortcutsDisabled(state, action: PayloadAction<boolean>) {
      state.shortcutsDisabled = action.payload;
    },
    setErrorCode(state, action: PayloadAction<ErrorCode>) {
      state.errorCode = action.payload;
    },
  },
});

export const {
  startLoading,
  finishLoading,
  failedLoading,
  setShortcutsDisabled,
  setErrorCode,
} = statusSlice.actions;
export default statusSlice.reducer;

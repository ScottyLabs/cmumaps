import { configureStore } from "@reduxjs/toolkit";

import mapUiReducer from "./features/mapUiSlice";

export const store = configureStore({
  reducer: {
    mapUi: mapUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

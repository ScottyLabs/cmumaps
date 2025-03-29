import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "@/store/features/api/apiSlice";

import mapUiReducer from "./features/mapUiSlice";

export const store = configureStore({
  reducer: {
    mapUi: mapUiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

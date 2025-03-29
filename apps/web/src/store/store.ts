import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "@/store/features/api/apiSlice";
import mapReducer from "@/store/features/mapSlice";
import uiReducer from "@/store/features/uiSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

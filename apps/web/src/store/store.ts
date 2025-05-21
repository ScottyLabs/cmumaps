import { configureStore } from "@reduxjs/toolkit";

import cardReducer from "@/store/features/cardSlice";
import eventReducer from "@/store/features/eventSlice";
import mapReducer from "@/store/features/mapSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    card: cardReducer,
    event: eventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

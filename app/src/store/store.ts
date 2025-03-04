import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";
import { listenerMiddleware } from "./middleware/listenerMiddleware";
import { webSocketMiddleware } from "./middleware/webSocketMiddleware";
import dataSlice from "./slices/dataSlice";
import floorSlice from "./slices/floorSlice";
import historySlice from "./slices/history/historySlice";
import lockSlice from "./slices/lockSlice";
import modeSlice from "./slices/modeSlice";
import mouseEventSlice from "./slices/mouseEventSlice";
import outlineSlice from "./slices/outlineSlice";
import polygonSlice from "./slices/polygonSlice";
import statusSlice from "./slices/statusSlice";
import uiSlice from "./slices/uiSlice";
// import usersSlice from './features/usersSlice';
import visibilitySlice from "./slices/visibilitySlice";

export const store = configureStore({
  reducer: {
    mode: modeSlice,
    mouseEvent: mouseEventSlice,
    ui: uiSlice,
    status: statusSlice,
    data: dataSlice,
    visibility: visibilitySlice,
    outline: outlineSlice,
    floor: floorSlice,
    // users: usersSlice,
    lock: lockSlice,
    history: historySlice,
    polygon: polygonSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(webSocketMiddleware)
      .concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

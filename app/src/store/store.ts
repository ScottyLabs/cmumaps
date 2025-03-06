import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";
import dataSlice from "./features/dataSlice";
import floorSlice from "./features/floorSlice";
import historySlice from "./features/history/historySlice";
import liveCursorSlice from "./features/liveCursor/liveCursorSlice";
import lockSlice from "./features/lockSlice";
import modeSlice from "./features/modeSlice";
import mouseEventSlice from "./features/mouseEventSlice";
import outlineSlice from "./features/outlineSlice";
import polygonSlice from "./features/polygonSlice";
import statusSlice from "./features/statusSlice";
import uiSlice from "./features/uiSlice";
// import usersSlice from './features/usersSlice';
import visibilitySlice from "./features/visibilitySlice";
import { listenerMiddleware } from "./middleware/listenerMiddleware";
import { webSocketMiddleware } from "./middleware/webSocketMiddleware";

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
    liveCursors: liveCursorSlice,
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

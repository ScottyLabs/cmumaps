import { createListenerMiddleware, addListener } from "@reduxjs/toolkit";

import { setModeListener } from "../features/modeSlice";
import type { RootState, AppDispatch } from "../store";

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();
export type AppStartListening = typeof startAppListening;

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();
export type AppAddListener = typeof addAppListener;

setModeListener(startAppListening);

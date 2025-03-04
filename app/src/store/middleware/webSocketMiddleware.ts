import { Action, Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

import { WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT } from "./webSocketActions";

// import { AppDispatch, RootState } from "../store";

// Socket instance
let socket: Socket | null = null;

// Socket middleware
export const webSocketMiddleware: Middleware = () => (next) => (action) => {
  const { type } = action as Action;

  switch (type) {
    // Connect to socket
    case WEBSOCKET_CONNECT: {
      if (socket !== null) {
        return;
      }

      // Create new socket connection
      socket = io(import.meta.env.VITE_SERVER_URL);
      break;
    }

    // Disconnect socket
    case WEBSOCKET_DISCONNECT:
      if (socket !== null) {
        socket.close();
        socket = null;
      }
      break;

    // Emit message through socket
    // case socketActions.SOCKET_EMIT:
    //   if (socket !== null) {
    //     const { event, data } = payload;
    //     socket.emit(event, data);
    //   }
    //   break;

    default:
      break;
  }

  return next(action);
};

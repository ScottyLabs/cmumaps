import { Action, Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

import {
  WEBSOCKET_JOIN,
  WEBSOCKET_DISCONNECT,
  JoinWebSocketAction,
  WEBSOCKET_LEAVE,
} from "./webSocketActions";

// import { AppDispatch, RootState } from "../store";

// Socket instance
let socket: Socket | null = null;

// Socket middleware
export const webSocketMiddleware: Middleware = () => (next) => (action) => {
  const { type } = action as Action;

  switch (type) {
    // Connect to socket
    case WEBSOCKET_JOIN: {
      if (socket === null) {
        // Create new socket connection
        socket = io(import.meta.env.VITE_SERVER_URL);
        socket.on("connect", () => {
          console.log("Connected to server");
        });
        socket.on("disconnect", () => {
          console.log("Disconnected from server");
        });
      }

      // Join room
      const { payload } = action as JoinWebSocketAction;
      const { floorCode } = payload;
      if (floorCode) {
        socket.emit("join", floorCode);
      }

      break;
    }

    case WEBSOCKET_LEAVE: {
      if (!socket) {
        return;
      }

      const { payload } = action as JoinWebSocketAction;
      const { floorCode } = payload;
      if (floorCode) {
        socket.emit("leave", floorCode);
      }
      break;
    }

    // Emit message through socket
    // case socketActions.SOCKET_EMIT:
    //   if (socket !== null) {
    //     const { event, data } = payload;
    //     socket.emit(event, data);
    //   }
    //   break;

    // Disconnect socket
    case WEBSOCKET_DISCONNECT:
      if (socket !== null) {
        socket.close();
        socket = null;
      }
      break;

    default:
      break;
  }

  return next(action);
};

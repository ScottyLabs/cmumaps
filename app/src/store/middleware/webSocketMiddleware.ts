import { Action, Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

// import { AppDispatch, RootState } from "../store";

// Action types for socket events
export const socketActions = {
  SOCKET_CONNECT: "socket/connect",
  SOCKET_DISCONNECT: "socket/disconnect",
  SOCKET_EMIT: "socket/emit",
  SOCKET_ON: "socket/on",
  SOCKET_CONNECTED: "socket/connected",
  SOCKET_DISCONNECTED: "socket/disconnected",
  SOCKET_MESSAGE_RECEIVED: "socket/messageReceived",
};

// interface ParamsType {
//   getState: () => RootState;
//   dispatch: AppDispatch;
// }

// Socket middleware
export const webSocketMiddleware: Middleware =
  (_params) => (next) => (action) => {
    let socket: Socket | null = null;
    const { type } = action as Action;

    switch (type) {
      // Connect to socket
      case socketActions.SOCKET_CONNECT: {
        if (socket !== null) {
          return;
        }

        // Create new socket connection
        socket = io(import.meta.env.VITE_SERVER_URL);

        // Setup socket event listeners
        socket.on("connect", () => {
          console.log("Connected to socket");
        });

        socket.on("disconnect", () => {
          console.log("Disconnected from socket");
        });

        break;
      }

      // Disconnect socket
      case socketActions.SOCKET_DISCONNECT:
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

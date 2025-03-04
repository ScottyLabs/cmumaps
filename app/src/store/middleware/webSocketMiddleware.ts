import { Action, Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

import {
  WebSocketEvents,
  WebSocketEventType,
  WebSocketPayloads,
} from "../../../../shared/webSocketTypes";
import { createNode } from "../api/nodeApiSlice";
import { AppDispatch } from "../store";
import {
  WEBSOCKET_JOIN,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_LEAVE,
} from "./webSocketActions";

// Socket instance
let socket: Socket | null = null;
export const getSocketId = () => socket?.id;

interface ParamsType {
  dispatch: AppDispatch;
}

// Get floor code from URL
const getFloorCode = () => {
  return window.location.pathname.split("/")[1];
};

// Create socket connection
const createSocket = (dispatch: AppDispatch) => {
  const socket = io(import.meta.env.VITE_SERVER_URL);

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  // Handle create node event
  socket.on<WebSocketEventType>(
    WebSocketEvents.CREATE_NODE,
    (message: WebSocketPayloads["create-node"]) => {
      const floorCode = getFloorCode();
      if (floorCode) {
        dispatch(createNode(floorCode, message));
      }
    },
  );

  return socket;
};

// Socket middleware
const webSocketMiddleware: Middleware = (params) => (next) => (action) => {
  const { dispatch } = params as ParamsType;
  const { type } = action as Action;
  const floorCode = getFloorCode();

  switch (type) {
    case WEBSOCKET_JOIN: {
      // Connect to socket
      if (socket === null) {
        socket = createSocket(dispatch);
      }

      // Join room
      if (floorCode) {
        socket.emit("join", floorCode);
      }

      break;
    }

    case WEBSOCKET_LEAVE: {
      if (socket && floorCode) {
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

export { webSocketMiddleware };

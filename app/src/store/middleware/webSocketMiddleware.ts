import { Action, Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

import {
  WebSocketEvents,
  WebSocketEventType,
  WebSocketPayloads,
} from "../../../../shared/webSocketTypes";
import { nodeApiSlice } from "../api/nodeApiSlice";
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

const createSocket = (floorCode: string | undefined, dispatch: AppDispatch) => {
  // Create new socket connection
  const socket = io(import.meta.env.VITE_SERVER_URL);

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on<WebSocketEventType>(
    WebSocketEvents.CREATE_NODE,
    (message: WebSocketPayloads["create-node"]) => {
      if (!floorCode) {
        return;
      }

      const { nodeId, node } = message;
      dispatch(
        nodeApiSlice.util.updateQueryData(
          "getFloorNodes",
          floorCode,
          (draft) => {
            draft[nodeId] = node;
          },
        ),
      );
    },
  );

  return socket;
};

// Socket middleware
const webSocketMiddleware: Middleware = (params) => (next) => (action) => {
  const { dispatch } = params as ParamsType;
  const { type } = action as Action;
  const floorCode = window.location.pathname.split("/")[1];

  switch (type) {
    case WEBSOCKET_JOIN: {
      // Connect to socket
      if (socket === null) {
        socket = createSocket(floorCode, dispatch);
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

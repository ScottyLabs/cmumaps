import { Action, Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

import {
  LiveUser,
  WebSocketEvents,
  WebSocketEventType,
  WebSocketPayloads,
} from "../../../../shared/webSocketTypes";
import { createNode, deleteNode } from "../api/nodeApiSlice";
import { setLiveUsers } from "../features/liveCursor/liveCursorSlice";
import { AppDispatch } from "../store";
import {
  WEBSOCKET_JOIN,
  WEBSOCKET_LEAVE,
  JoinWebSocketAction,
  LeaveWebSocketAction,
} from "./webSocketActions";

// Socket instance
let socket: Socket | null = null;

// acceptable approach since the socket id won't change
export const getSocketId = () => socket?.id;

interface ParamsType {
  dispatch: AppDispatch;
}

// Get floor code from URL
const getFloorCode = () => {
  return window.location.pathname.split("/")[1];
};

// Create socket connection
const createSocket = (user: LiveUser, dispatch: AppDispatch) => {
  const socket = io(import.meta.env.VITE_SERVER_URL, {
    query: {
      userName: user.userName,
      userColor: user.color,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  // Handle sync users event
  socket.on<WebSocketEventType>(
    WebSocketEvents.SYNC_USERS,
    (message: WebSocketPayloads["sync-users"]) => {
      dispatch(setLiveUsers(message.users));
    },
  );

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

  // Handle delete node event
  socket.on<WebSocketEventType>(
    WebSocketEvents.DELETE_NODE,
    (message: WebSocketPayloads["delete-node"]) => {
      const floorCode = getFloorCode();
      if (floorCode) {
        dispatch(deleteNode(floorCode, message));
      }
    },
  );

  // close WebSocket connection and leave room when closing window
  window.addEventListener("beforeunload", () => {
    if (socket) {
      const floorCode = getFloorCode();
      if (floorCode) {
        socket.emit("leave", floorCode);
      }
      socket.close();
    }
  });

  return socket;
};

// Socket middleware
const webSocketMiddleware: Middleware = (params) => (next) => (action) => {
  const { dispatch } = params as ParamsType;
  const { type } = action as Action;
  const floorCode = getFloorCode();

  switch (type) {
    case WEBSOCKET_JOIN: {
      const { payload } = action as JoinWebSocketAction;
      const { user } = payload;

      // Connect to socket
      if (socket === null) {
        socket = createSocket(user, dispatch);
      }

      // Join room
      if (floorCode) {
        socket.emit("join", floorCode);
      }

      break;
    }

    case WEBSOCKET_LEAVE: {
      const { payload } = action as LeaveWebSocketAction;
      const { floorCode } = payload;
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

    default:
      break;
  }

  return next(action);
};

export { webSocketMiddleware };

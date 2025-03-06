import { LiveUser } from "../features/liveCursor/liveCursorSlice";

// Action types
export const WEBSOCKET_JOIN = "WEBSOCKET_JOIN";
export const WEBSOCKET_LEAVE = "WEBSOCKET_LEAVE";
export const WEBSOCKET_DISCONNECT = "WEBSOCKET_DISCONNECT";
export const WEBSOCKET_SEND = "WEBSOCKET_SEND";

// Action creators
export type JoinWebSocketAction = ReturnType<typeof joinWebSocket>;
export const joinWebSocket = (user: LiveUser) => ({
  type: WEBSOCKET_JOIN,
  payload: { user },
});

export const leaveWebSocket = () => ({
  type: WEBSOCKET_LEAVE,
});

export const disconnectWebSocket = () => ({
  type: WEBSOCKET_DISCONNECT,
});

export const sendWebSocketMessage = (message: string) => ({
  type: WEBSOCKET_SEND,
  payload: { message },
});

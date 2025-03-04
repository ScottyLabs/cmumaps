// Action types
export const WEBSOCKET_JOIN = "WEBSOCKET_JOIN";
export const WEBSOCKET_LEAVE = "WEBSOCKET_LEAVE";
export const WEBSOCKET_DISCONNECT = "WEBSOCKET_DISCONNECT";
export const WEBSOCKET_SEND = "WEBSOCKET_SEND";

// Action interfaces
// export interface JoinWebSocketAction {
//   type: typeof WEBSOCKET_JOIN;
//   payload: { floorCode?: string };
// }

// export interface LeaveWebSocketAction {
//   type: typeof WEBSOCKET_JOIN;
//   payload: { floorCode: string };
// }

// Action creators
export const joinWebSocket = (floorCode?: string) => ({
  type: WEBSOCKET_JOIN,
  payload: { floorCode },
});

export const leaveWebSocket = (floorCode?: string) => ({
  type: WEBSOCKET_LEAVE,
  payload: { floorCode },
});

export const disconnectWebSocket = () => ({
  type: WEBSOCKET_DISCONNECT,
});

export const sendWebSocketMessage = (message: string) => ({
  type: WEBSOCKET_SEND,
  payload: { message },
});

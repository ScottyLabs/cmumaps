// Action types
export const WEBSOCKET_JOIN = "WEBSOCKET_JOIN";
export const WEBSOCKET_DISCONNECT = "WEBSOCKET_DISCONNECT";
export const WEBSOCKET_SEND = "WEBSOCKET_SEND";

// Action interfaces
export interface JoinWebSocketAction {
  type: typeof WEBSOCKET_JOIN;
  payload: {
    floorCode?: string;
  };
}

// Action creators
export const joinWebSocket = (floorCode?: string) => ({
  type: WEBSOCKET_JOIN,
  payload: { floorCode },
});

export const disconnectWebSocket = () => ({
  type: WEBSOCKET_DISCONNECT,
});

export const sendWebSocketMessage = (message: string) => ({
  type: WEBSOCKET_SEND,
  payload: { message },
});

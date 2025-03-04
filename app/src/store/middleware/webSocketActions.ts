// Action types
export const WEBSOCKET_CONNECT = "WEBSOCKET_CONNECT";
export const WEBSOCKET_DISCONNECT = "WEBSOCKET_DISCONNECT";
export const WEBSOCKET_SEND = "WEBSOCKET_SEND";

// Action creators
export const connectWebSocket = () => ({
  type: WEBSOCKET_CONNECT,
});

export const disconnectWebSocket = () => ({
  type: WEBSOCKET_DISCONNECT,
});

export const sendWebSocketMessage = (message: string) => ({
  type: WEBSOCKET_SEND,
  payload: { message },
});

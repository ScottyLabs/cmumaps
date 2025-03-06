import { LiveUser } from "../../../../shared/webSocketTypes";
import { CursorInfo } from "../features/liveCursor/liveCursorTypes";

// Action types
export const WEBSOCKET_JOIN = "WEBSOCKET_JOIN";
export const WEBSOCKET_LEAVE = "WEBSOCKET_LEAVE";
export const WEBSOCKET_BROADCAST = "WEBSOCKET_BROADCAST";

// Action creators
export type JoinWebSocketAction = ReturnType<typeof joinWebSocket>;
export const joinWebSocket = (user: LiveUser) => ({
  type: WEBSOCKET_JOIN,
  payload: { user },
});

export type LeaveWebSocketAction = ReturnType<typeof leaveWebSocket>;
export const leaveWebSocket = (floorCode?: string) => ({
  type: WEBSOCKET_LEAVE,
  // we need to send the floorCode because the url changes before the middleware can process the action
  payload: { floorCode },
});

export type BroadcastWebSocketAction = ReturnType<typeof broadcastWebSocket>;
export const broadcastWebSocket = (message: BroadcastMessageType) => ({
  type: WEBSOCKET_BROADCAST,
  payload: { message },
});

// Broadcast message types
interface BroadcastMessageType {
  socketId: string;
  cursorInfos: CursorInfo[];
}

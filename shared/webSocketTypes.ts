import type { NodeInfo } from "./types.ts";

// Define all WebSocket event names as string literals
export const WebSocketEvents = {
  CREATE_NODE: "create-node",
} as const;

// Create a type from the values
export type WebSocketEventType =
  (typeof WebSocketEvents)[keyof typeof WebSocketEvents];

// Event payload types
export interface CreateNodePayload {
  nodeId: string;
  node: NodeInfo;
}

// Define payload types for each event
export type WebSocketPayloads = {
  [WebSocketEvents.CREATE_NODE]: CreateNodePayload;
};

import type { NodeInfo } from "./types.ts";

// Define all WebSocket event names as string literals
export const WebSocketEvents = {
  CREATE_NODE: "create-node",
  DELETE_NODE: "delete-node",
} as const;

// Create a type from the values
export type WebSocketEventType =
  (typeof WebSocketEvents)[keyof typeof WebSocketEvents];

// Event payload types
export interface CreateNodePayload {
  nodeId: string;
  nodeInfo: NodeInfo;
}

export interface DeleteNodePayload {
  nodeId: string;
}

// Define payload types for each event
export type WebSocketPayloads = {
  [WebSocketEvents.CREATE_NODE]: CreateNodePayload;
  [WebSocketEvents.DELETE_NODE]: DeleteNodePayload;
};

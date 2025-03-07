import type { NodeInfo } from "./types.ts";

export interface LiveUser {
  userName: string;
  color: string;
}

// Define all WebSocket event names as string literals
export const WebSocketEvents = {
  SYNC_USERS: "sync-users",

  CREATE_NODE: "create-node",
  DELETE_NODE: "delete-node",
  UPDATE_NODE: "update-node",

  CREATE_EDGE: "create-edge",
  DELETE_EDGE: "delete-edge",
} as const;

// Create a type from the values
export type WebSocketEventType =
  (typeof WebSocketEvents)[keyof typeof WebSocketEvents];

// Event payload types
export interface SyncUserPayload {
  users: Record<string, LiveUser>;
}

export interface CreateNodePayload {
  nodeId: string;
  nodeInfo: NodeInfo;
}

export interface DeleteNodePayload {
  nodeId: string;
}

export interface UpdateNodePayload {
  nodeId: string;
  nodeInfo: NodeInfo;
}

export interface CreateEdgePayload {
  inNodeId: string;
  outNodeId: string;
}

export interface DeleteEdgePayload {
  inNodeId: string;
  outNodeId: string;
}

// Define payload types for each event
export type WebSocketPayloads = {
  [WebSocketEvents.SYNC_USERS]: SyncUserPayload;

  [WebSocketEvents.CREATE_NODE]: CreateNodePayload;
  [WebSocketEvents.DELETE_NODE]: DeleteNodePayload;
  [WebSocketEvents.UPDATE_NODE]: UpdateNodePayload;

  [WebSocketEvents.CREATE_EDGE]: CreateEdgePayload;
  [WebSocketEvents.DELETE_EDGE]: DeleteEdgePayload;
};

import type {
  CreateEdgeAcrossFloorsPayload,
  CreateEdgePayload,
  DeleteEdgeAcrossFloorsPayload,
  DeleteEdgePayload,
} from "./edgeTypes";
import type {
  CreateNodePayload,
  DeleteNodePayload,
  UpdateNodePayload,
} from "./nodeTypes";
import type {
  CreatePoiPayload,
  DeletePoiPayload,
  UpdatePoiPayload,
} from "./poiTypes";
import type {
  CreateRoomPayload,
  DeleteRoomPayload,
  UpdateRoomPayload,
} from "./roomTypes";
import type { SyncUserPayload } from "./userTypes";

// Define all WebSocket event names as string literals
export const WebSocketEvents = {
  SYNC_USERS: "sync-users",

  CREATE_NODE: "create-node",
  DELETE_NODE: "delete-node",
  UPDATE_NODE: "update-node",

  CREATE_EDGE: "create-edge",
  DELETE_EDGE: "delete-edge",
  CREATE_EDGE_ACROSS_FLOORS: "create-edge-across-floors",
  DELETE_EDGE_ACROSS_FLOORS: "delete-edge-across-floors",

  CREATE_ROOM: "create-room",
  DELETE_ROOM: "delete-room",
  UPDATE_ROOM: "update-room",

  CREATE_POI: "create-poi",
  DELETE_POI: "delete-poi",
  UPDATE_POI: "update-poi",
} as const;

// Create a type from the values
export type WebSocketEventType =
  (typeof WebSocketEvents)[keyof typeof WebSocketEvents];

// Define payload types for each event
export type WebSocketPayloads = {
  [WebSocketEvents.SYNC_USERS]: SyncUserPayload;

  [WebSocketEvents.CREATE_NODE]: CreateNodePayload;
  [WebSocketEvents.DELETE_NODE]: DeleteNodePayload;
  [WebSocketEvents.UPDATE_NODE]: UpdateNodePayload;

  [WebSocketEvents.CREATE_EDGE]: CreateEdgePayload;
  [WebSocketEvents.DELETE_EDGE]: DeleteEdgePayload;
  [WebSocketEvents.CREATE_EDGE_ACROSS_FLOORS]: CreateEdgeAcrossFloorsPayload;
  [WebSocketEvents.DELETE_EDGE_ACROSS_FLOORS]: DeleteEdgeAcrossFloorsPayload;

  [WebSocketEvents.CREATE_ROOM]: CreateRoomPayload;
  [WebSocketEvents.DELETE_ROOM]: DeleteRoomPayload;
  [WebSocketEvents.UPDATE_ROOM]: UpdateRoomPayload;

  [WebSocketEvents.CREATE_POI]: CreatePoiPayload;
  [WebSocketEvents.DELETE_POI]: DeletePoiPayload;
  [WebSocketEvents.UPDATE_POI]: UpdatePoiPayload;
};

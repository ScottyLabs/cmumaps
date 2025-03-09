import { SyncUserPayload } from './userTypes';
import { CreateNodePayload, DeleteNodePayload, UpdateNodePayload } from './nodeTypes';
import { CreateEdgeAcrossFloorsPayload, CreateEdgePayload, DeleteEdgeAcrossFloorsPayload, DeleteEdgePayload } from './edgeTypes';
import { CreateRoomPayload, DeleteRoomPayload, UpdateRoomPayload } from './roomTypes';
import { CreatePoiPayload, DeletePoiPayload, UpdatePoiPayload } from './poiTypes';

export declare const WebSocketEvents: {
    readonly SYNC_USERS: "sync-users";
    readonly CREATE_NODE: "create-node";
    readonly DELETE_NODE: "delete-node";
    readonly UPDATE_NODE: "update-node";
    readonly CREATE_EDGE: "create-edge";
    readonly DELETE_EDGE: "delete-edge";
    readonly CREATE_EDGE_ACROSS_FLOORS: "create-edge-across-floors";
    readonly DELETE_EDGE_ACROSS_FLOORS: "delete-edge-across-floors";
    readonly CREATE_ROOM: "create-room";
    readonly DELETE_ROOM: "delete-room";
    readonly UPDATE_ROOM: "update-room";
    readonly CREATE_POI: "create-poi";
    readonly DELETE_POI: "delete-poi";
    readonly UPDATE_POI: "update-poi";
};
export type WebSocketEventType = (typeof WebSocketEvents)[keyof typeof WebSocketEvents];
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

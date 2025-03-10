import { Polygon } from 'geojson';

declare interface CreateEdgeAcrossFloorsPayload {
    outFloorCode: string;
    inNodeId: string;
    outNodeId: string;
}

declare interface CreateEdgePayload {
    inNodeId: string;
    outNodeId: string;
}

declare interface CreateNodePayload {
    nodeId: string;
    nodeInfo: NodeInfo;
}

declare interface CreatePoiPayload {
    poiId: string;
    poiInfo: PoiInfo;
}

declare interface CreateRoomPayload {
    roomId: string;
    roomNodes: string[];
    roomInfo: RoomInfo;
}

declare interface DeleteEdgeAcrossFloorsPayload {
    outFloorCode: string;
    inNodeId: string;
    outNodeId: string;
}

declare interface DeleteEdgePayload {
    inNodeId: string;
    outNodeId: string;
}

declare interface DeleteNodePayload {
    nodeId: string;
}

declare interface DeletePoiPayload {
    poiId: string;
}

declare interface DeleteRoomPayload {
    roomId: string;
}

declare interface EdgeInfo {
    outFloorCode?: string;
}

declare interface LiveUser {
    userName: string;
    color: string;
}

declare interface NodeInfo {
    /**
     * the position (x and y coordinates) of the node
     */
    pos: PdfCoordinate;
    /**
     * (neighbor's id to the edge) for each neighbor of the node
     */
    neighbors: Record<string, EdgeInfo>;
    /**
     * A node belongs to a room if it is inside the room
     * If null, the node is not associated with any room
     */
    roomId: string | null;
}

declare interface PdfCoordinate {
    x: number;
    y: number;
}

declare interface PoiInfo {
    /**
     * The type of the POI
     */
    type: PoiType;
    /**
     * The node id that the POI is associated with
     */
    nodeId: string;
}

declare type PoiType = (typeof PoiTypes)[number];

declare const PoiTypes: readonly ["Vending Machine", "Water Fountain", "Printer", ""];

declare interface RoomInfo {
    /**
     * The short name of the room, without the building name but including the
     * floor level (e.g. '121' for CUC 121)
     */
    name: string;
    /**
     * The coordinates of the label of the room
     */
    labelPosition: PdfCoordinate;
    /**
     * The type of the room
     */
    type: RoomType;
    /**
     * The name under which the room is known (e.g. 'McConomy Auditorium')
     * The one that will be displayed.
     */
    displayAlias?: string;
    /**
     * List of names under which the room is known (e.g. 'McConomy Auditorium')
     * Used for searching
     */
    aliases: string[];
    /**
     * Geojson polygon that outlines the room
     */
    polygon: Polygon;
}

declare type RoomType = (typeof RoomTypes)[number];

declare const RoomTypes: readonly ["Default", "Corridor", "Auditorium", "Office", "Classroom", "Operational", "Conference", "Study", "Laboratory", "Computer Lab", "Studio", "Workshop", "Vestibule", "Storage", "Restroom", "Stairs", "Elevator", "Ramp", "Dining", "Food", "Store", "Library", "Sport", "Parking", "Inaccessible", ""];

declare interface SyncUserPayload {
    users: Record<string, LiveUser>;
}

declare interface UpdateNodePayload {
    nodeId: string;
    nodeInfo: NodeInfo;
}

declare interface UpdatePoiPayload {
    poiId: string;
    poiType: PoiType;
}

declare interface UpdateRoomPayload {
    roomId: string;
    roomInfo: Partial<RoomInfo>;
}

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

export declare type WebSocketEventType = (typeof WebSocketEvents)[keyof typeof WebSocketEvents];

export declare type WebSocketPayloads = {
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

export { }

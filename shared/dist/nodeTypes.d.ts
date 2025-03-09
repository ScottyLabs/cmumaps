export declare interface CreateNodePayload {
    nodeId: string;
    nodeInfo: NodeInfo;
}

export declare interface DeleteNodePayload {
    nodeId: string;
}

declare interface EdgeInfo {
    outFloorCode?: string;
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

export declare interface UpdateNodePayload {
    nodeId: string;
    nodeInfo: NodeInfo;
}

export { }

import { Polygon } from 'geojson';
import { Position } from 'geojson';

export declare interface DoorInfo {
    /**
     * list of lines that outlines the door
     */
    lineList: number[][];
    /**
     * center of the door points
     */
    center: PdfCoordinate;
    /**
     * the id of the rooms this door connects
     */
    roomIds: string[];
}

export declare interface EdgeInfo {
    outFloorCode?: string;
}

export declare type EdgeType = (typeof ValidCrossFloorEdgeTypes)[number];

export declare interface GeoCoordinate {
    latitude: number;
    longitude: number;
}

export declare type Graph = Record<string, NodeInfo>;

/**
 * Misc types
 */
export declare type Mst = Record<string, Record<string, boolean>>;

export declare interface NodeInfo {
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

export declare interface PdfCoordinate {
    x: number;
    y: number;
}

export declare interface Placement {
    geoCenter: GeoCoordinate;
    pdfCenter: PdfCoordinate;
    scale: number;
    angle: number;
}

export declare interface PoiInfo {
    /**
     * The type of the POI
     */
    type: PoiType;
    /**
     * The node id that the POI is associated with
     */
    nodeId: string;
}

export declare type Pois = Record<string, PoiInfo>;

export declare type PoiType = (typeof PoiTypes)[number];

export declare const PoiTypes: readonly ["Vending Machine", "Water Fountain", "Printer", ""];

export { Polygon }

export { Position }

export declare interface RoomInfo {
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

export declare type Rooms = Record<string, RoomInfo>;

export declare type RoomType = (typeof RoomTypes)[number];

export declare const RoomTypes: readonly ["Default", "Corridor", "Auditorium", "Office", "Classroom", "Operational", "Conference", "Study", "Laboratory", "Computer Lab", "Studio", "Workshop", "Vestibule", "Storage", "Restroom", "Stairs", "Elevator", "Ramp", "Dining", "Food", "Store", "Library", "Sport", "Parking", "Inaccessible", ""];

export declare const ValidCrossFloorEdgeTypes: string[];

export declare const WalkwayTypeList: string[];

export { }

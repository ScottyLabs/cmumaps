import { Polygon } from 'geojson';

export declare interface CreateRoomPayload {
    roomId: string;
    roomNodes: string[];
    roomInfo: RoomInfo;
}

export declare interface DeleteRoomPayload {
    roomId: string;
}

declare interface PdfCoordinate {
    x: number;
    y: number;
}

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

export declare interface UpdateRoomPayload {
    roomId: string;
    roomInfo: Partial<RoomInfo>;
}

export { }

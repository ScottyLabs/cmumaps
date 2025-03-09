export declare interface CreatePoiPayload {
    poiId: string;
    poiInfo: PoiInfo;
}

export declare interface DeletePoiPayload {
    poiId: string;
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

export declare interface UpdatePoiPayload {
    poiId: string;
    poiType: PoiType;
}

export { }

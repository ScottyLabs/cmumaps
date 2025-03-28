export const PoiTypes = [
  "Vending Machine",
  "Water Fountain",
  "Printer",
  "",
] as const;

export type PoiType = (typeof PoiTypes)[number];

export interface PoiInfo {
  /**
   * The type of the POI
   */
  type: PoiType;

  /**
   * The node id that the POI is associated with
   */
  nodeId: string;
}
//#endregion

// Floor data types
export type Pois = Record<string, PoiInfo>;

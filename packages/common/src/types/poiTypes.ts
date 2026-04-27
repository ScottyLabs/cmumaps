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
   * The latitude of the POI
   */
  latitude: number;

  /**
   * The longitude of the POI
   */
  longitude: number;

  /**
   * The building this POI sits in, if any
   */
  buildingCode?: string | null;

  /**
   * The floor level this POI sits on, if any
   */
  floorLevel?: string | null;
}
//#endregion

// Floor data types
export type Pois = Record<string, PoiInfo>;

export const PoiTypes = [
  "Vending Machine",
  "Water Fountain",
  "Printer",
  "AED",
  "Bike Rack",
  "Restroom",
  "Emergency Phone",
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

/**
 * OSM tag for each PoiType, used for ingestion and contribution
 */
export const PoiOsmTags: Record<Exclude<PoiType, "">, { key: string; value: string }> = {
  "Vending Machine": { key: "amenity", value: "vending_machine" },
  "Water Fountain": { key: "amenity", value: "drinking_water" },
  Printer: { key: "amenity", value: "printer" },
  AED: { key: "emergency", value: "defibrillator" },
  "Bike Rack": { key: "amenity", value: "bicycle_parking" },
  Restroom: { key: "amenity", value: "toilets" },
  "Emergency Phone": { key: "emergency", value: "phone" },
};
//#endregion

// Floor data types
export type Pois = Record<string, PoiInfo>;

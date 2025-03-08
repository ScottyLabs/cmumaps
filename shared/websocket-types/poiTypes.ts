import type { PoiType } from "../types.ts";

export interface CreatePoiPayload {
  poiId: string;
  poiType: PoiType;
}

export interface DeletePoiPayload {
  poiId: string;
}

export interface UpdatePoiPayload {
  poiId: string;
  poiType: PoiType;
}

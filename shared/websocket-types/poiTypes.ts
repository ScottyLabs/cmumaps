import type { PoiInfo } from "../types.ts";

export interface CreatePoiPayload {
  poiId: string;
  poiInfo: PoiInfo;
}

export interface DeletePoiPayload {
  poiId: string;
}

export interface UpdatePoiPayload {
  poiId: string;
  poiInfo: PoiInfo;
}

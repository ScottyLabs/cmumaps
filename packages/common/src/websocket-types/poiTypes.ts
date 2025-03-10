import type { PoiInfo, PoiType } from "../types";

export interface CreatePoiPayload {
  poiId: string;
  poiInfo: PoiInfo;
}

export interface DeletePoiPayload {
  poiId: string;
}

export interface UpdatePoiPayload {
  poiId: string;
  poiType: PoiType;
}

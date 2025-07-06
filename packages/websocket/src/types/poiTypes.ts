import type { PoiInfo, PoiType } from "@cmumaps/common/src/types";

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

import { GeoCoordinate, PdfCoordinate } from "./coordTypes";

export interface BuildingInfo {
  buildingCode: string;
  name: string;
  labelLatitude: number;
  labelLongitude: number;
  shape: GeoCoordinate[];
  hitbox: GeoCoordinate[];
}

export interface Placement {
  geoCenter: GeoCoordinate;
  pdfCenter: PdfCoordinate;
  scale: number;
  angle: number;
}

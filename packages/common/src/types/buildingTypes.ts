import { GeoCoordinate, PdfCoordinate } from "./coordTypes";

export interface Building {
  code: string;
  name: string;
  isMapped: boolean;
  defaultOrdinal: number | null;
  defaultFloor: string;
  floors: string[];
  labelLatitude: number;
  labelLongitude: number;
  shape: GeoCoordinate[][];
  hitbox: GeoCoordinate[];
}

export interface Placement {
  geoCenter: GeoCoordinate;
  pdfCenter: PdfCoordinate;
  scale: number;
  angle: number;
}

export type Buildings = Record<string, Building>;

import { GeoCoordinate, PdfCoordinate } from "./coordTypes";

export interface Placement {
  geoCenter: GeoCoordinate;
  pdfCenter: PdfCoordinate;
  scale: number;
  angle: number;
}

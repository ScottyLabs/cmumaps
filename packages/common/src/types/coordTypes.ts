import { z } from "zod";

export const geoCoordinateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export const pdfCoordinateSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type GeoCoordinate = z.infer<typeof geoCoordinateSchema>;
export type PdfCoordinate = z.infer<typeof pdfCoordinateSchema>;

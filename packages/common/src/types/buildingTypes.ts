import { z } from "zod";
import { geoCoordinateSchema, pdfCoordinateSchema } from "./coordTypes";

export const buildingMetadataSchema = z.object({
  buildingCode: z.string(),
  name: z.string(),
  defaultFloor: z.string().nullable(),
});

export type BuildingMetadata = z.infer<typeof buildingMetadataSchema>;

export const buildingSchema = z.object({
  code: z.string(),
  name: z.string(),
  isMapped: z.boolean(),
  defaultOrdinal: z.number().nullable(),
  defaultFloor: z.string().nullable(),
  floors: z.array(z.string()),
  labelLatitude: z.number(),
  labelLongitude: z.number(),
  shape: z.array(z.array(geoCoordinateSchema)),
  hitbox: z.array(geoCoordinateSchema),
});

export type Building = z.infer<typeof buildingSchema>;

export const placementSchema = z.object({
  geoCenter: geoCoordinateSchema,
  pdfCenter: pdfCoordinateSchema,
  scale: z.number(),
  angle: z.number(),
});
export type Placement = z.infer<typeof placementSchema>;

export const buildingsSchema = z.record(z.string(), buildingSchema);
export type Buildings = z.infer<typeof buildingsSchema>;

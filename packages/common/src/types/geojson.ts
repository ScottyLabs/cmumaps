import { z } from "zod";
// This file is a copy of the @types/geojson/index.d.ts file. Can't use the
// @types/geojson package because it's not compatible with the tsoa package.

export const positionSchema = z.array(z.number());
export type Position = z.infer<typeof positionSchema>;

export const polygonSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(positionSchema)),
});

export type Polygon = z.infer<typeof polygonSchema>;

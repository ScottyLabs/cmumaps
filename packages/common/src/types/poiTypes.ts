import { z } from "zod";

export const PoiTypes = [
  "Vending Machine",
  "Water Fountain",
  "Printer",
  "",
] as const;

export const poiTypeSchema = z.enum(PoiTypes);
export type PoiType = z.infer<typeof poiTypeSchema>;

export const poiInfoSchema = z.object({
  type: poiTypeSchema,
  nodeId: z.string(),
});
export type PoiInfo = z.infer<typeof poiInfoSchema>;

export const poisSchema = z.record(z.string(), poiInfoSchema);
export type Pois = z.infer<typeof poisSchema>;

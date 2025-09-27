import { z } from "zod";

export const floorSchema = z.object({
  buildingCode: z.string(),
  level: z.string(),
});
export type Floor = z.infer<typeof floorSchema>;

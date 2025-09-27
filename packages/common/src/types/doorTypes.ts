import { z } from "zod";
import { pdfCoordinateSchema } from "./coordTypes";

export const doorInfoSchema = z.object({
  lineList: z.array(z.array(z.number())),
  center: pdfCoordinateSchema,
  roomIds: z.array(z.string()),
});

export type DoorInfo = z.infer<typeof doorInfoSchema>;

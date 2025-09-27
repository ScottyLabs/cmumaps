import { z } from "zod";
import { pdfCoordinateSchema } from "./coordTypes";
import { polygonSchema } from "./geojson";

export const RoomTypes = [
  "Default",
  "Corridor",
  "Auditorium",
  "Office",
  "Classroom",
  "Operational", // Used for storage or maintenance, not publicly accessible
  "Conference",
  "Study",
  "Laboratory",
  "Computer Lab",
  "Studio",
  "Workshop",
  "Vestibule",
  "Storage",
  "Restroom",
  "Stairs",
  "Elevator",
  "Ramp",
  "Dining",
  "Food",
  "Store",
  "Library",
  "Sport",
  "Parking",
  "Inaccessible",
  "", // not assigned
] as const;

export const roomTypeSchema = z.enum(RoomTypes);
export type RoomType = z.infer<typeof roomTypeSchema>;

export const WalkwayTypeList = ["Corridor", "Ramp", "Library"];

export const roomInfoSchema = z.object({
  name: z.string(),
  labelPosition: pdfCoordinateSchema,
  type: roomTypeSchema,
  displayAlias: z.string().optional(),
  aliases: z.array(z.string()),
  polygon: polygonSchema,
});
export type RoomInfo = z.infer<typeof roomInfoSchema>;

export const roomsSchema = z.record(z.string(), roomInfoSchema);
export type Rooms = z.infer<typeof roomsSchema>;

import { z } from "zod";
import { geoCoordinateSchema } from "./coordTypes";
import { floorSchema } from "./floorTypes";
import { roomTypeSchema } from "./roomTypes";

export const geoRoomSchema = z.object({
  labelPosition: geoCoordinateSchema,
  floor: floorSchema,
  type: roomTypeSchema,
  alias: z.string().optional(),
  points: z.array(z.array(geoCoordinateSchema)),
  id: z.string(),
});
export type GeoRoom = z.infer<typeof geoRoomSchema>;

export const geoRoomsSchema = z.record(z.string(), geoRoomSchema);
export type GeoRooms = z.infer<typeof geoRoomsSchema>;

import { z } from "zod";
import { geoCoordinateSchema, pdfCoordinateSchema } from "./coordTypes";

export const ValidCrossFloorEdgeTypes = [
  "Ramp",
  "Stairs",
  "Elevator",
  "", // not assigned
];

export const edgeTypeSchema = z.enum(
  ValidCrossFloorEdgeTypes as ["Ramp", "Stairs", "Elevator", ""],
);
export type EdgeType = z.infer<typeof edgeTypeSchema>;

export const edgeInfoSchema = z.object({
  outFloorCode: z.string().optional(),
});
export type EdgeInfo = z.infer<typeof edgeInfoSchema>;

export const nodeInfoSchema = z.object({
  pos: pdfCoordinateSchema,
  neighbors: z.record(z.string(), edgeInfoSchema),
  roomId: z.string().nullable(),
});
export type NodeInfo = z.infer<typeof nodeInfoSchema>;

export const geoNodeSchema = z.object({
  pos: geoCoordinateSchema,
  neighbors: z.record(z.string(), edgeInfoSchema),
  roomId: z.string().nullable(),
});
export type GeoNode = z.infer<typeof geoNodeSchema>;

export const graphSchema = z.record(z.string(), nodeInfoSchema);
export type Graph = z.infer<typeof graphSchema>;

export const geoNodesSchema = z.record(z.string(), geoNodeSchema);
export type GeoNodes = z.infer<typeof geoNodesSchema>;

export const mstSchema = z.record(
  z.string(),
  z.record(z.string(), z.boolean()),
);
export type Mst = z.infer<typeof mstSchema>;

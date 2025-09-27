import { z } from "zod";

export const eventTracks = [
  "CMU Tradition",
  "Food",
  "Awards/Celebration",
  "Exhibit/Tour",
  "Health/Wellness",
  "Alumni",
  "Performance",
] as const;

export const eventTrackSchema = z.enum(eventTracks);
export type EventTrack = z.infer<typeof eventTrackSchema>;

export const eventTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  tracks: z.array(eventTrackSchema),
});
export type EventType = z.infer<typeof eventTypeSchema>;

export const eventsResponseSchema = z.object({
  events: z.array(eventTypeSchema),
  prevEvent: eventTypeSchema.optional(),
  nextEvent: eventTypeSchema.optional(),
});
export type EventsResponse = z.infer<typeof eventsResponseSchema>;

export const eventResponseSchema = z.object({
  event: eventTypeSchema,
});
export type EventResponse = z.infer<typeof eventResponseSchema>;

export const eventCoordinatesSchema = z.object({
  id: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  tracks: z.array(eventTrackSchema),
});
export type EventCoordinates = z.infer<typeof eventCoordinatesSchema>;

export const currentEventResponseSchema = z.object({
  events: z.array(eventCoordinatesSchema),
});
export type CurrentEventResponse = z.infer<typeof currentEventResponseSchema>;

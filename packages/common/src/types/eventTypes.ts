export interface EventType {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
}

export interface EventsResponse {
  events: EventType[];
  prevEvent?: EventType;
  nextEvent?: EventType;
}

const eventTracks = [
  "CMU Tradition",
  "Food",
  "Awards/Celebration",
  "Exhibit/Tour",
  "Health/Wellness",
  "Alumni",
  "Performance",
] as const;

export type EventTrack = (typeof eventTracks)[number];

export interface DetailedEventType {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  latitude: number | null;
  longitude: number | null;
  tracks: EventTrack[];
}

export interface EventResponse {
  event: DetailedEventType;
}

export interface EventCoordinates {
  id: string;
  latitude: number | null;
  longitude: number | null;
  tracks: EventTrack[];
}

export interface CurrentEventResponse {
  events: EventCoordinates[];
}

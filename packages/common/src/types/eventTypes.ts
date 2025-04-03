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

export interface DetailedEventType {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  latitude: number | null;
  longitude: number | null;
}

export interface EventResponse {
  event: DetailedEventType;
}

export interface EventCoordinates {
  id: string;
  latitude: number | null;
  longitude: number | null;
}

export interface CurrentEventResponse {
  events: EventCoordinates[];
}

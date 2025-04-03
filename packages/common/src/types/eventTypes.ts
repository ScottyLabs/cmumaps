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

export interface EventResponse {
  event: EventType;
}

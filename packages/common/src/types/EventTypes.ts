export interface EventType {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
}

export interface EventResponse {
  events: EventType[];
  prevEvent?: EventType;
  nextEvent?: EventType;
}

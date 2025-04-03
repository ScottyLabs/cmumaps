import { useEffect, useState } from "react";

import EventPin from "@/components/map-display/events/EventPin";
import { useGetCurrentEventQuery } from "@/store/features/api/eventApiSlice";
import { useAppSelector } from "@/store/hooks";

const EventPins = () => {
  // 12 hours from now
  const [timestamp, setTimestamp] = useState(Date.now() + 12 * 60 * 60 * 1000);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
      // updates every 5 minutes
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const selectedTracks = useAppSelector((state) => state.event.selectedTracks);
  const selectedReqs = useAppSelector((state) => state.event.selectedReqs);
  const { data } = useGetCurrentEventQuery({
    timestamp,
    tracks: selectedTracks,
    reqs: selectedReqs,
  });

  return data?.events.map((event) => (
    <EventPin key={event.id} eventId={event.id} />
  ));
};

export default EventPins;

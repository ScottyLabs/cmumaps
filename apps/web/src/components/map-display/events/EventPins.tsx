import { useEffect, useState } from "react";

import { useGetCurrentEventQuery } from "@/store/features/api/eventApiSlice";
import { useAppSelector } from "@/store/hooks";

const EventPins = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
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

  console.log(data);

  return <div>EventPins</div>;
};

export default EventPins;

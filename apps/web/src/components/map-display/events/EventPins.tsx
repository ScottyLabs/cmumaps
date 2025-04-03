import { useEffect, useState } from "react";

import { useGetCurrentEventQuery } from "@/store/features/api/eventApiSlice";

const EventPins = () => {
  const [timestamp, setTimestamp] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
      // updates every 5 minutes
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const { data } = useGetCurrentEventQuery({
    timestamp,
    filters: [],
    reqs: [],
  });

  console.log(data);

  return <div>EventPins</div>;
};

export default EventPins;

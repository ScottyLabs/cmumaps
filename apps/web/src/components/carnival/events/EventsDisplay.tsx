import { useState } from "react";

import EventsDatePicker from "@/components/carnival/events/EventsDatePicker";
import EventsFilter from "@/components/carnival/events/EventsFilter";

const EventsDisplay = () => {
  const [activeDate, setActiveDate] = useState("All Dates");

  return (
    <div className="m-2 space-y-4">
      <EventsDatePicker activeDate={activeDate} setActiveDate={setActiveDate} />
      <EventsFilter />
    </div>
  );
};

export default EventsDisplay;

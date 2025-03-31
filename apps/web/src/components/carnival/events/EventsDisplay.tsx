import { useState } from "react";

import EventsDatePicker from "@/components/carnival/events/EventsDatePicker";
import EventsFilter from "@/components/carnival/events/EventsFilter";

const EventsDisplay = () => {
  const [activeDate, setActiveDate] = useState("All Dates");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className="m-2 min-h-screen space-y-4"
      onClick={() => setIsDropdownOpen(false)}
    >
      <EventsDatePicker activeDate={activeDate} setActiveDate={setActiveDate} />
      <EventsFilter
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
    </div>
  );
};

export default EventsDisplay;

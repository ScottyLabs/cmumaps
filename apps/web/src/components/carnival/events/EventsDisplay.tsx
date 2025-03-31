import { useState } from "react";

import EventsDatePicker from "@/components/carnival/events/filters/EventsDatePicker";
import EventsFilter from "@/components/carnival/events/filters/EventsFilter";

const EventsDisplay = () => {
  const [selectedDate, setSelectedDate] = useState("3/28-4/6");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedReqs, setSelectedReqs] = useState<string[]>([]);

  console.log(selectedTypes);
  console.log(selectedReqs);
  console.log(selectedDate);

  return (
    <div
      className="m-2 min-h-screen space-y-4"
      onClick={() => {
        setIsDropdownOpen(false);
        console.log("clicked");
      }}
    >
      <EventsDatePicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <EventsFilter
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedReqs={selectedReqs}
        setSelectedReqs={setSelectedReqs}
      />
    </div>
  );
};

export default EventsDisplay;

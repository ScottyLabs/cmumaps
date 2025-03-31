import { useState } from "react";

import InfiniteScrollWrapper from "@/components/carnival/events/displays/InfiniteScrollWrapper";
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
      className="m-2 flex flex-col space-y-4 overflow-auto"
      onClick={() => setIsDropdownOpen(false)}
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
      <InfiniteScrollWrapper />
    </div>
  );
};

export default EventsDisplay;

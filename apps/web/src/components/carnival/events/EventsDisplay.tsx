import { useState } from "react";

import EventsList from "@/components/carnival/events/displays/EventsList";
import EventsDatePicker from "@/components/carnival/events/filters/EventsDatePicker";
import EventsFilter from "@/components/carnival/events/filters/EventsFilter";
import {
  CarnivalDate,
  getTimestampByDate,
} from "@/components/carnival/events/utils/timeUtils";

interface Props {
  map: mapkit.Map | null;
}

const EventsDisplay = ({ map }: Props) => {
  const [selectedDate, setSelectedDate] = useState<CarnivalDate>("3/28-4/6");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className="m-2 flex flex-col space-y-4 overflow-hidden"
      onClick={() => setIsDropdownOpen(false)}
    >
      <EventsDatePicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <EventsFilter
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
      <EventsList timestamp={getTimestampByDate(selectedDate)} map={map} />
    </div>
  );
};

export default EventsDisplay;

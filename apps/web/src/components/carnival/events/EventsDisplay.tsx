import { useState } from "react";

import DatePicker from "@/components/carnival/events/DatePicker";

const EventsDisplay = () => {
  const [activeDate, setActiveDate] = useState("All Dates");

  console.log(activeDate);

  return (
    <div>
      <DatePicker activeDate={activeDate} setActiveDate={setActiveDate} />
    </div>
  );
};

export default EventsDisplay;

import { EventType } from "@cmumaps/common";

import { useState } from "react";

import EventDisplay from "@/components/carnival/events/displays/EventBody";
import EventTitle from "@/components/carnival/events/displays/EventTitle";

interface Props {
  event: EventType;
}

const Event = ({ event }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const renderTrigger = () => {
    return (
      <EventTitle event={event} isOpen={isOpen} handleClick={handleClick} />
    );
  };

  const isPastEvent = new Date(event.endTime) < new Date();

  return (
    <div
      className={`my-2 flex flex-col rounded-lg p-3 ${
        isPastEvent ? "bg-gray-400" : "bg-gray-200"
      }`}
    >
      {renderTrigger()}
      {isOpen && <EventDisplay event={event} />}
    </div>
  );
};

export default Event;

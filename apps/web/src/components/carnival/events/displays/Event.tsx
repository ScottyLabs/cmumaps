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

  return (
    <div className="flex flex-col">
      {renderTrigger()}
      {isOpen && <EventDisplay event={event} />}
    </div>
  );
};

export default Event;

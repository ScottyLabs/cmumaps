import { EventType } from "@cmumaps/common";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import EventInfo from "@/components/carnival/events/displays/EventInfo";

interface Props {
  event: EventType;
  isOpen: boolean;
  handleClick: () => void;
}

const EventTitle = ({ event, isOpen, handleClick }: Props) => {
  return (
    <div
      className="flex cursor-pointer flex-row justify-between"
      onClick={handleClick}
    >
      <EventInfo event={event} />
      <div>
        {isOpen ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
      </div>
    </div>
  );
};

export default EventTitle;

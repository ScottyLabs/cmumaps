import { EventType } from "@cmumaps/common";

interface Props {
  event: EventType;
}

const EventDisplay = ({ event }: Props) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderDate = (event: EventType) => {
    if (
      new Date(event.startTime).getDate() == new Date(event.endTime).getDate()
    ) {
      return formatDate(event.startTime);
    } else {
      return `${formatDate(event.startTime)} - ${formatDate(event.endTime)}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="flex flex-col">
      <div className="text-lg font-medium">{event.name}</div>
      <div className="text-sm text-black">Date: {renderDate(event)}</div>
      <div className="text-sm text-black">
        Time: {formatTime(event.startTime)} - {formatTime(event.endTime)}
      </div>
      <div className="text-sm text-black">Location: {event.location}</div>
    </div>
  );
};

export default EventDisplay;

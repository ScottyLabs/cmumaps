import { EventType } from "@cmumaps/common";

interface Props {
  event: EventType;
}

const EventDisplay = ({ event }: Props) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="flex flex-col">
      <div className="text-lg font-bold">{event.name}</div>
      <div className="text-sm text-gray-500">
        {/* without seconds */}
        {formatDate(event.startTime)} - {formatDate(event.endTime)}
      </div>
      <div className="text-sm text-gray-500">{event.location}</div>
    </div>
  );
};

export default EventDisplay;

import { EventType } from "@cmumaps/common";

import { useNavigate } from "react-router";

interface Props {
  event: EventType;
}

const EventBody = ({ event }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="mt-2 space-y-2 bg-white p-3 text-sm">
      <div dangerouslySetInnerHTML={{ __html: event.description }} />
      <div className="flex justify-end">
        <button
          className="cursor-pointer rounded-lg border-2 bg-blue-500 p-1 text-white"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          View on map
        </button>
      </div>
    </div>
  );
};

export default EventBody;

import { EventType } from "@cmumaps/common";

interface Props {
  event: EventType;
}

const EventBody = ({ event }: Props) => {
  return (
    <div
      className="mt-2 bg-white p-3 text-sm"
      dangerouslySetInnerHTML={{ __html: event.description }}
    ></div>
  );
};

export default EventBody;

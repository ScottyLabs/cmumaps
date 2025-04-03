import { Annotation } from "mapkit-react";

import { useNavigate } from "react-router";

import eventPin from "@/assets/carnival/icons/ticket-booth-default.svg";
import { useGetEventQuery } from "@/store/features/api/eventApiSlice";

interface Props {
  eventId: string;
}

const EventPin = ({ eventId }: Props) => {
  const navigate = useNavigate();
  const { data, isFetching } = useGetEventQuery(eventId);

  if (!data || !eventId || isFetching) {
    return <></>;
  }

  const coordinate = {
    latitude: data.event.latitude,
    longitude: data.event.longitude,
  };

  if (!coordinate.latitude || !coordinate.longitude) {
    return <></>;
  }

  return (
    <Annotation
      latitude={coordinate.latitude}
      longitude={coordinate.longitude}
      onSelect={() => navigate(`/events/${eventId}`)}
    >
      <img
        src={eventPin}
        alt="Event Pin"
        className="h-10 w-10 cursor-pointer"
      />
    </Annotation>
  );
};

export default EventPin;

import { Annotation } from "mapkit-react";

import eventPin from "@/assets/carnival/icons/ticket-booth-default.svg";
import { useGetEventQuery } from "@/store/features/api/eventApiSlice";

interface Props {
  eventId: string;
}

const EventPin = ({ eventId }: Props) => {
  const { data, isFetching } = useGetEventQuery(eventId);

  const handleSelect = () => {
    console.log("event pin clicked");
  };

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
      onSelect={handleSelect}
    >
      <img src={eventPin} alt="Event Pin" className="h-10 w-10" />
    </Annotation>
  );
};

export default EventPin;

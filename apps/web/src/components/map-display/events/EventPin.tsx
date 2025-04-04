import { Annotation } from "mapkit-react";

import { useNavigate } from "react-router";

import EventIcon from "@/components/map-display/events/EventIcon";
import useLocationParams from "@/hooks/useLocationParams";
import { useGetEventQuery } from "@/store/features/api/eventApiSlice";

interface Props {
  eventId: string;
}

export const pinSize = {
  default: { width: 40, height: 40 },
  selected: { width: 60, height: 60 },
};

export const pinOffsetY = {
  default: -20,
  selected: -30,
};

const EventPin = ({ eventId }: Props) => {
  const navigate = useNavigate();
  const { data, isFetching } = useGetEventQuery(eventId);
  const { eventId: selectedEventId } = useLocationParams();
  const selected = selectedEventId === eventId;

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
      displayPriority="required"
      anchorOffsetY={selected ? pinOffsetY.selected : pinOffsetY.default}
      size={selected ? pinSize.selected : pinSize.default}
      selected={selected}
    >
      <EventIcon event={data.event} />
    </Annotation>
  );
};

export default EventPin;

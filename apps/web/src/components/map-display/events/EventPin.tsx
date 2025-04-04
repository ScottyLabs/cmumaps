import { Annotation } from "mapkit-react";

import { useNavigate } from "react-router";

import eventPin from "@/assets/carnival/icons/ticket-booth-default.svg";
import greyEventPin from "@/assets/carnival/icons/ticket-booth-grey.svg";
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

  const getIcon = () => {
    if (new Date(data.event.startTime) > new Date()) {
      return greyEventPin;
    }
    return eventPin;
  };

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
      <img src={getIcon()} alt="Event Pin" className="cursor-pointer" />
    </Annotation>
  );
};

export default EventPin;

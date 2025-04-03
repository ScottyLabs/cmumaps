import EventPin from "@/components/map-display/events/EventPin";
import useLocationParams from "@/hooks/useLocationParams";

const SelectedEventPin = () => {
  const { eventId } = useLocationParams();

  if (!eventId) {
    return <></>;
  }

  return <EventPin eventId={eventId} />;
};

export default SelectedEventPin;

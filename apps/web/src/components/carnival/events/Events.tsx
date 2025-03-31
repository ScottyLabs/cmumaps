import EventsDisplay from "@/components/carnival/events/EventsDisplay";
import CollapsibleWrapper from "@/components/shared/CollapsibleWrapper";
import useLocationParams from "@/hooks/useLocationParams";

const Events = () => {
  const { isCardOpen } = useLocationParams();

  if (isCardOpen) {
    return <></>;
  }

  return (
    <CollapsibleWrapper title="Spring Carnival">
      <EventsDisplay />
    </CollapsibleWrapper>
  );
};

export default Events;

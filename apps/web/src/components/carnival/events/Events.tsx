import EventsDisplay from "@/components/carnival/events/EventsDisplay";
import CollapsibleWrapper from "@/components/shared/CollapsibleWrapper";
import useLocationParams from "@/hooks/useLocationParams";
import { useAppSelector } from "@/store/hooks";

const Events = () => {
  const { isCardOpen } = useLocationParams();
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);

  if (isCardOpen || isSearchOpen) {
    return <></>;
  }

  return (
    <CollapsibleWrapper title="Spring Carnival">
      <EventsDisplay />
    </CollapsibleWrapper>
  );
};

export default Events;

import EventsDisplay from "@/components/carnival/events/EventsDisplay";
import CollapsibleWrapper from "@/components/shared/CollapsibleWrapper";
import useLocationParams from "@/hooks/useLocationParams";
import { useAppSelector } from "@/store/hooks";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const Events = ({ mapRef }: Props) => {
  const { isCardOpen } = useLocationParams();
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);

  if (isCardOpen || isSearchOpen) {
    return <></>;
  }

  return (
    <CollapsibleWrapper title="Spring Carnival">
      <EventsDisplay mapRef={mapRef} />
    </CollapsibleWrapper>
  );
};

export default Events;

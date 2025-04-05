import EventsDisplay from "@/components/carnival/events/EventsDisplay";
import CollapsibleWrapper from "@/components/shared/CollapsibleWrapper";
import useLocationParams from "@/hooks/useLocationParams";
import { useAppSelector } from "@/store/hooks";

interface Props {
  map: mapkit.Map | null;
}

const Events = ({ map }: Props) => {
  const { isCardOpen } = useLocationParams();
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);

  if (isCardOpen || isSearchOpen) {
    return <></>;
  }

  return (
    <CollapsibleWrapper title="Spring Carnival">
      <EventsDisplay map={map} />
    </CollapsibleWrapper>
  );
};

export default Events;

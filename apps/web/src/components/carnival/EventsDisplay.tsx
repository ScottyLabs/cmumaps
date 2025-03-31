import CollapsibleWrapper from "@/components/shared/CollapsibleWrapper";
import useLocationParams from "@/hooks/useLocationParams";

const EventsDisplay = () => {
  const { isCardOpen } = useLocationParams();

  if (isCardOpen) {
    return <></>;
  }

  return (
    <CollapsibleWrapper title="Spring Carnival">
      <div>EventsDisplay</div>
    </CollapsibleWrapper>
  );
};

export default EventsDisplay;

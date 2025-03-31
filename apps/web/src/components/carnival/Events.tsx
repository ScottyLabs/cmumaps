import CollapsibleWrapper from "@/components/shared/CollapsibleWrapper";
import useLocationParams from "@/hooks/useLocationParams";

const Events = () => {
  const { isCardOpen } = useLocationParams();

  if (isCardOpen) {
    return <></>;
  }

  return (
    <CollapsibleWrapper title="Spring Carnival">
      <div>Events</div>
    </CollapsibleWrapper>
  );
};

export default Events;

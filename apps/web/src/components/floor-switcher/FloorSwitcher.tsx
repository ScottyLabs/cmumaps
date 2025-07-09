import $api from "@/api/client";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import FloorSwitcherDisplay from "./FloorSwitcherDisplay";

/**
 * This component determines if the floor switcher should be shown.
 */
const FloorSwitcher = () => {
  // Library hooks
  const { data: user } = $api.useQuery("get", "/auth/userInfo");
  const isMobile = useIsMobile();

  // Global states
  const floor = useBoundStore((state) => state.focusedFloor);
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);

  // Query data
  const { data: buildings } = $api.useQuery("get", "/buildings");

  // Custom hooks
  const { isCardOpen } = useLocationParams();

  // Don't show the floor switcher in mobile
  // if either the card is open or the search is open
  if (isMobile && (isCardOpen || isSearchOpen)) {
    return <></>;
  }

  // Don't show the floor switcher if the user is not signed in
  if (!user) {
    return <></>;
  }

  // Don't show the floor switcher if there is no focused floor
  if (!floor) {
    return <></>;
  }

  // Don't show the floor switcher if building data is not loaded
  if (!buildings) {
    return <></>;
  }

  // Don't show the floor switcher if invalid building code
  const building = buildings[floor.buildingCode];
  if (!building) {
    return <></>;
  }

  return (
    <div className="-translate-x-1/2 fixed bottom-2 left-1/2 w-fit px-2">
      <FloorSwitcherDisplay building={building} floor={floor} />
    </div>
  );
};

export default FloorSwitcher;

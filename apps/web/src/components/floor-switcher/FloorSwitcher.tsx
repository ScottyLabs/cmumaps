import $api from "@/api/client";
import useIsMobile from "@/hooks/useIsMobile";
import useUser from "@/hooks/useUser";
import useBoundStore from "@/store";
import { CardStates } from "@/store/cardSlice";
import FloorSwitcherDisplayDesktop from "./desktop/FloorSwitcherDisplayDesktop";
import FloorSwitcherDisplayMobile from "./mobile/FloorSwitcherDisplayMobile";

/**
 * This component determines if the floor switcher should be shown.
 */
const FloorSwitcher = () => {
  // Library hooks
  const { hasAccess } = useUser();
  const isMobile = useIsMobile();

  // Global states
  const floor = useBoundStore((state) => state.focusedFloor);
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const cardStatus = useBoundStore((state) => state.cardStatus);

  // Query data
  const { data: buildings } = $api.useQuery("get", "/buildings");

  // Don't show the floor switcher in mobile
  // if either the card is open or the search is open
  if (isMobile && (isSearchOpen || cardStatus !== CardStates.COLLAPSED)) {
    return;
  }

  // Don't show the floor switcher if the user is not signed in
  if (!hasAccess) {
    return;
  }

  // Don't show the floor switcher if there is no focused floor
  if (!floor) {
    return;
  }

  // Don't show the floor switcher if building data is not loaded
  if (!buildings) {
    return;
  }

  // Don't show the floor switcher if invalid building code
  const building = buildings[floor.buildingCode];
  if (!building) {
    return;
  }

  if (isMobile) {
    return (
      <FloorSwitcherDisplayMobile
        building={building}
        initialFloorLevel={floor.level}
      />
    );
  }

  return (
    <div className="-translate-x-1/2 fixed bottom-2 left-1/2 w-fit px-2">
      <FloorSwitcherDisplayDesktop building={building} floor={floor} />
    </div>
  );
};

export default FloorSwitcher;

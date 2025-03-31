import { useUser } from "@clerk/clerk-react";

import { useMemo } from "react";

import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";
import { useAppSelector } from "@/store/hooks";

import FloorSwitcherDisplay from "./FloorSwitcherDisplay";

/**
 * Responsibilities:
 * - Authentication
 * - Distinction between mobile and desktop (Positioning of the floor switcher)
 * - When to show the floor switcher
 */
const FloorSwitcher = () => {
  // hooks
  const { isSignedIn } = useUser();
  const { isCardOpen } = useLocationParams();
  const isMobile = useIsMobile();

  // query data
  const { data: buildings } = useGetBuildingsQuery();

  // store states
  const floor = useAppSelector((state) => state.map.focusedFloor);
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);

  // don't show floor switcher in mobile if the card is open or the search is open
  const showFloorSwitcherMobile = useMemo(() => {
    return !(isMobile && (isCardOpen || isSearchOpen));
  }, [isCardOpen, isMobile, isSearchOpen]);

  // don't show floor switcher if the user is not signed in
  if (!isSignedIn) {
    return <></>;
  }

  // only show floor switcher if there is focused floor
  if (!buildings || !floor || !showFloorSwitcherMobile) {
    return <></>;
  }

  // only show floor switcher if there is focused floor
  const building = buildings[floor.buildingCode];
  if (!building) {
    return <></>;
  }

  return (
    <div className="fixed bottom-2 left-1/2 w-fit -translate-x-1/2 px-2">
      <FloorSwitcherDisplay building={building} floor={floor} />
    </div>
  );
};

export default FloorSwitcher;

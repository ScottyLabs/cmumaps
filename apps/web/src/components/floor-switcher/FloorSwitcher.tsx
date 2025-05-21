import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

import { useMemo } from "react";

import { getBuildingsQueryOptions } from "@/api/apiClient";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";

import FloorSwitcherDisplay from "./FloorSwitcherDisplay";

/**
 * Responsibilities:
 * - Authentication
 * - Distinction between mobile and desktop (Positioning of the floor switcher)
 * - When to show the floor switcher
 */
const FloorSwitcher = () => {
  // Library hooks
  const { isSignedIn } = useUser();
  const isMobile = useIsMobile();

  // Global states
  const floor = useBoundStore((state) => state.focusedFloor);
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);

  // Query data
  const { data: buildings } = useQuery(getBuildingsQueryOptions());

  // Custom hooks
  const { isCardOpen } = useLocationParams();

  // Don't show floor switcher in mobile if the card is open or the search is open
  const showFloorSwitcherMobile = useMemo(() => {
    return !(isMobile && (isCardOpen || isSearchOpen));
  }, [isCardOpen, isMobile, isSearchOpen]);

  // Don't show floor switcher if the user is not signed in
  if (!isSignedIn) {
    return <></>;
  }

  // Only show floor switcher if there is focused floor
  if (!buildings || !floor || !showFloorSwitcherMobile) {
    return <></>;
  }

  // Only show floor switcher if there is focused floor
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

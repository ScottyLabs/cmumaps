import { useUser } from "@clerk/clerk-react";

import FloorplanOverlay from "@/components/map-display/floorplans-overlay/FloorplanOverlay";
import { useAppSelector } from "@/store/hooks";

const FloorPlansOverlay = () => {
  const { isSignedIn } = useUser();
  const focusedFloor = useAppSelector((state) => state.map.focusedFloor);

  // only show floor plans if user is signed in and a floor is focused
  if (!focusedFloor || !isSignedIn) {
    return;
  }

  return (
    <div>
      <FloorplanOverlay floor={focusedFloor} />
    </div>
  );
};

export default FloorPlansOverlay;

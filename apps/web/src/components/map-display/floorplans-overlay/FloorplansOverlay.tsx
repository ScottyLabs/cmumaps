import { useUser } from "@clerk/clerk-react";

import FloorplanOverlay from "@/components/map-display/floorplans-overlay/FloorplanOverlay";
import useMapStore from "@/store/roomSlice";

const FloorPlansOverlay = () => {
  const { isSignedIn } = useUser();
  const focusedFloor = useMapStore((state) => state.focusedFloor);

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

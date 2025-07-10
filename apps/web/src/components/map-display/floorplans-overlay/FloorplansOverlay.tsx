import FloorplanOverlay from "@/components/map-display/floorplans-overlay/FloorplanOverlay";
import useUser from "@/hooks/useUser";
import useBoundStore from "@/store";

const FloorPlansOverlay = () => {
  const { isSignedIn } = useUser();
  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  // Only show floorplans if user is signed in and a floor is focused
  if (!focusedFloor || !isSignedIn) {
    return <></>;
  }

  return <FloorplanOverlay floor={focusedFloor} />;
};

export default FloorPlansOverlay;

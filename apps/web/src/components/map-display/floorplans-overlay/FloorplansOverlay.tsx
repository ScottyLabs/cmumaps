import { FloorplanOverlay } from "@/components/map-display/floorplans-overlay/FloorplanOverlay.tsx";
import { useUser } from "@/hooks/useUser.ts";
import { useBoundStore } from "@/store/index.ts";

const FloorPlansOverlay = () => {
  const { isSignedIn } = useUser();
  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  // Only show floorplans if user is signed in and a floor is focused
  if (!(focusedFloor && isSignedIn)) {
    return;
  }

  return <FloorplanOverlay floor={focusedFloor} />;
};

export { FloorPlansOverlay };

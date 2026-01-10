import { FloorplanOverlay } from "@/components/map-display/floorplans-overlay/FloorplanOverlay.tsx";
import { useUser } from "@/hooks/useUser.ts";
import { useBoundStore } from "@/store/index.ts";

const FloorplansOverlay = () => {
  const user = useUser();
  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  // Only show floorplans if user is signed in and a floor is focused
  if (!(focusedFloor && user)) {
    return;
  }

  return <FloorplanOverlay floor={focusedFloor} />;
};

export { FloorplansOverlay };

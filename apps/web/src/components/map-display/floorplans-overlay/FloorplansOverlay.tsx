import { FloorplanOverlay } from "@/components/map-display/floorplans-overlay/FloorplanOverlay.tsx";
import { useUser } from "@/hooks/useUser.ts";
import { useBoundStore } from "@/store/index.ts";

const FloorplansOverlay = () => {
  const user = useUser();
  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  // Authenticated users can see all floorplans.
  // Unauthenticated users can only see CUC floorplans.
  const canShowFloorplans = user || focusedFloor?.buildingCode === "CUC";

  // Only show floorplans if a floor is focused
  if (!(focusedFloor && canShowFloorplans)) {
    return;
  }

  return <FloorplanOverlay floor={focusedFloor} />;
};

export { FloorplansOverlay };

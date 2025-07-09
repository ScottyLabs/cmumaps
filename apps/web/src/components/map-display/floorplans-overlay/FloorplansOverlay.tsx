import $api from "@/api/client";
import FloorplanOverlay from "@/components/map-display/floorplans-overlay/FloorplanOverlay";
import useBoundStore from "@/store";

const FloorPlansOverlay = () => {
  const { data: user } = $api.useQuery("get", "/auth/userInfo");
  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  // Only show floorplans if user is signed in and a floor is focused
  if (!focusedFloor || !user) {
    return <></>;
  }

  return <FloorplanOverlay floor={focusedFloor} />;
};

export default FloorPlansOverlay;

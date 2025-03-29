import { useLocation } from "react-router";

import { getFloorLevelFromRoomName } from "@/utils/floorUtils";

const useLocationParams = () => {
  const location = useLocation();
  const path = location.pathname;

  const [buildingCode, roomName] = path.split("/")?.[1]?.split("-") || [];
  const floor = roomName ? getFloorLevelFromRoomName(roomName) : null;

  return {
    buildingCode,
    floor,
    roomName,
    isCardOpen: !!buildingCode,
  };
};

export default useLocationParams;

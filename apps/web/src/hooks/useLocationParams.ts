import { useLocation } from "react-router";

import { getFloorLevelFromRoomName } from "@/utils/floorUtils";

interface Params {
  buildingCode?: string;
  floor?: string;
  roomName?: string;
  eventId?: string;
  isCardOpen: boolean;
}

const useLocationParams = (): Params => {
  const location = useLocation();
  const path = location.pathname;

  if (path.split("/")?.[1] === "events") {
    return {
      eventId: path.split("/")?.[2],
      isCardOpen: true,
    };
  }
  const [buildingCode, roomName] = path.split("/")?.[1]?.split("-") || [];
  const floor = roomName ? getFloorLevelFromRoomName(roomName) : undefined;

  return {
    buildingCode,
    floor,
    roomName,
    isCardOpen: !!buildingCode,
  };
};

export default useLocationParams;

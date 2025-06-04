import { useLocation } from "react-router";

import { getFloorLevelFromRoomName } from "@/utils/floorUtils";

import { useQuery } from "@tanstack/react-query";
import { getBuildingsQueryOptions } from "@/api/apiClient";

import { useNavigate } from "react-router";

interface Params {
  buildingCode?: string;
  floor?: string;
  roomName?: string;
  eventId?: string;
  carnivalEvent?: "booth" | "buggy" | "mobot";
  isCardOpen: boolean;
}

const useLocationParams = (): Params => {
  const location = useLocation();
  const path = location.pathname;

  const navigate = useNavigate();

  let [buildingCode, roomName] = path.split("/")?.[1]?.split("-") || [];
  const floor = getFloorLevelFromRoomName(roomName);

  const { data: buildings } = useQuery(getBuildingsQueryOptions());

  const building = buildings && buildingCode && buildings[buildingCode];

  if (path.split("/")?.[1] === "events") {
    return {
      eventId: path.split("/")?.[2],
      isCardOpen: true,
    };
  }

  if (path.split("/")?.[1] === "events") {
    return {
      eventId: path.split("/")?.[2],
      isCardOpen: true,
    };
  }

  if (path.split("/")?.[1] === "carnival") {
    return {
      carnivalEvent: path.split("/")?.[2]?.toLowerCase() as
        | "booth"
        | "buggy"
        | "mobot",
      isCardOpen: true,
    };
  }

  // if (path.split("/")?.[1] && path.split("/")?.[1] != "" && !building) {
  //   // toast.error("Invalid building code");
  //   navigate("/");
  //   buildingCode = undefined;
  // }

  return {
    buildingCode,
    floor,
    roomName,
    isCardOpen: !!buildingCode,
  };
};

export default useLocationParams;

import { useQuery } from "@tanstack/react-query";
import { getBuildingsQueryOptions } from "@/api/apiClient";

import { useLocation } from "react-router";

import { getFloorLevelFromRoomName } from "@/utils/floorUtils";
import { toast } from "react-toastify";


const useVerifyUrlParam = () => {
  const location = useLocation();
  const path = location.pathname;

  const [buildingCode, roomName] = path.split("/")?.[1]?.split("-") || [];
  const floor = getFloorLevelFromRoomName(roomName);

  const { data: buildings } = useQuery(getBuildingsQueryOptions());

  const building = buildings && buildingCode && buildings[buildingCode];

  if (!building) {
    toast.error("Invalid building code");
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
  

  return {
    buildingCode,
    floor,
    roomName,
    isCardOpen: !!buildingCode,
  };
};

export default useVerifyUrlParam;

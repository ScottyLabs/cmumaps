import { useQuery } from "@tanstack/react-query";
import { getBuildingsQueryOptions } from "@/api/apiClient";

import { useLocation, useNavigate } from "react-router";

import { getFloorLevelFromRoomName } from "@/utils/floorUtils";
import { toast } from "react-toastify";


const useVerifyUrlParam = () => {
  const location = useLocation();
  const path = location.pathname;

  const navigate = useNavigate();

  const [buildingCode, roomName] = path.split("/")?.[1]?.split("-") || [];
  const floor = getFloorLevelFromRoomName(roomName);

  const { data: buildings } = useQuery(getBuildingsQueryOptions());

  const building = buildings && buildingCode && buildings[buildingCode];

  if (path.split("/")?.[1] === "events") {
    return;
  }

  if (path.split("/")?.[1] === "carnival") {
    return;
  }

  if (path.split("/")?.[1] && path.split("/")?.[1] != "" && buildings && !building) {
    toast.error("Invalid building code");
    navigate("/");
  }
  
};

export default useVerifyUrlParam;

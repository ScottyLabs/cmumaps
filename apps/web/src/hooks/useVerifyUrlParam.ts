import { useQuery } from "@tanstack/react-query";
import { getBuildingsQueryOptions, getRoomsQueryOptions } from "@/api/apiClient";

import { useLocation, useNavigate } from "react-router";

import { getFloorLevelFromRoomName } from "@/utils/floorUtils";
import { toast } from "react-toastify";


const useVerifyUrlParam = () => {
  const location = useLocation();
  const path = location.pathname;

  const navigate = useNavigate();

  const { data: buildings } = useQuery(getBuildingsQueryOptions());

  const suffix = path.split("/")?.[1] || "";

  const [buildingCode, roomName] = suffix.split("-") || [];
  const floor = getFloorLevelFromRoomName(roomName) || "";

  const floorCode = buildingCode && floor ? `${buildingCode}-${floor}` : null;
  const { data: rooms } = useQuery(getRoomsQueryOptions(floorCode));

  const building = buildings && buildingCode && buildings[buildingCode];

  if (suffix === "") {
    return;
  }

  if (suffix === "events") {
    return;
  }

  if (suffix === "carnival") {
    return;
  }

  if (!buildings) {
    // toast.error("Buildings data not available");
    return;
  }

  if (!building) {
    toast.error("Invalid building code");
    navigate("/");
  }

  if (!roomName || roomName === "") {
    return;
  }

  if (!floor || !(building && building.floors.includes(floor))) {
    toast.error("Invalid floor level");
    navigate("/" + buildingCode);
  }

  if (roomName === floor) {
    return;
  }

  if (!rooms) {
    // toast.error("Rooms data not available");
    return;
  }

  // toast.info("Rooms data loaded successfully");

  if (!rooms[roomName]) {
    toast.error("Invalid room name");
    navigate("/" + buildingCode + "-" + floor);
  }

  
  
};

export default useVerifyUrlParam;

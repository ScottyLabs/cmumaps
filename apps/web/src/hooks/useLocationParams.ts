import {
  getBuildingsQueryOptions,
  getRoomsQueryOptions,
} from "@/api/apiClient";
import { getFloorLevelFromRoomName } from "@/utils/floorUtils";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

interface Params {
  buildingCode?: string;
  floor?: string;
  roomName?: string;
  eventId?: string;
  carnivalEvent?: "booth" | "buggy" | "mobot";
  isCardOpen: boolean;
  error?: string;
}

const verifyURLParams = (): string | undefined => {
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

  if (!floor || (building && !building.floors.includes(floor))) {
    toast.error("Invalid floor level");
    navigate(`/${buildingCode}`);
  }

  if (roomName === floor) {
    return;
  }

  if (!rooms) {
    return;
  }

  if (!rooms[roomName]) {
    toast.error("Invalid room name");
    navigate(`/${buildingCode}-${floor}`);
  }
};

const useLocationParams = (): Params => {
  const location = useLocation();
  const path = location.pathname;

  const error = verifyURLParams();
  if (error) {
    toast.error(error);
    return {
      error,
      isCardOpen: false,
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
  const [buildingCode, roomName] = path.split("/")?.[1]?.split("-") || [];
  const floor = getFloorLevelFromRoomName(roomName);

  return {
    buildingCode,
    floor,
    roomName,
    isCardOpen: !!buildingCode,
  };
};

export default useLocationParams;

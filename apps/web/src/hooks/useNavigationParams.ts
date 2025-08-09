import { useQueryState } from "nuqs";
import { toast } from "react-toastify";
import $api from "@/api/client";
import $rapi from "@/api/rustClient";
import type { NavPaths } from "@/types/navTypes";
import { getFloorLevelFromRoomName } from "@/utils/floorUtils";
import useNavigateLocationParams from "./useNavigateLocationParams";

interface Params {
  navPaths?: NavPaths;
  isNavOpen: boolean;
  srcName?: string;
  dstName?: string;
  srcShortName?: string;
  dstShortName?: string;
  setSrc: (src: string | null) => void;
  setDst: (dst: string | null) => void;
  swap: () => void;
}

const getWaypointParams = (
  point: string,
): { query?: string; label?: string; labelShort?: string; error?: string } => {
  const { data: buildings } = $api.useQuery("get", "/buildings");
  const pointSplit = point.split("-");
  const buildingCode = pointSplit[0];
  const roomName = pointSplit.slice(1).join("-");
  const floorName = getFloorLevelFromRoomName(roomName);

  const floorCode =
    buildingCode && floorName ? `${buildingCode}-${floorName}` : null;
  const { data: rooms } = $api.useQuery(
    "get",
    "/floors/{floorCode}/floorplan",
    { params: { path: { floorCode: floorCode ?? "" } } },
    { enabled: !!floorCode },
  );

  if (point.includes("user")) {
    return {
      query: "40.444035,-79.94463",
      label: "Your Location",
      labelShort: "You",
    };
  }

  if (point.includes(",")) {
    return { query: point, label: "Coordinate", labelShort: "Coord" };
  }

  if (point.includes("-")) {
    if (!rooms || !buildings) return {};

    const room = rooms[roomName];
    if (!room) return { error: `Invalid Room Waypoint ${roomName}` };

    const label =
      room.alias || `${buildings[room.floor.buildingCode]?.name} ${roomName}`;
    const labelShort = `${buildingCode} ${roomName}`;
    return { query: room.id, label, labelShort };
  }

  if (!buildingCode || !buildings?.[buildingCode])
    return { error: "Invalid Building" };

  return {
    query: buildingCode,
    label: buildings[buildingCode]?.name,
    labelShort: buildingCode,
  };
};

const useNavPaths = (): Params => {
  const navigate = useNavigateLocationParams();

  const [src, setSrc] = useQueryState("src");
  const [dst, setDst] = useQueryState("dst");

  const {
    query: srcQuery,
    label: srcName,
    labelShort: srcShortName,
    error: srcError,
  } = getWaypointParams(src ?? "");

  const {
    query: dstQuery,
    label: dstName,
    labelShort: dstShortName,
    error: dstError,
  } = getWaypointParams(dst ?? "");

  const { data: navPaths } = $rapi.useQuery("get", "/path", {
    params: {
      query: {
        start: srcQuery ?? "",
        end: dstQuery ?? "",
      },
    },
    enabled: !!src && !!dst,
  }) as { data: NavPaths | undefined };

  const swap = () => {
    const temp = src;
    navigate(temp || "");
    setSrc(dst);
    setDst(temp);
  };

  if (!src || !dst || src === "" || dst === "") {
    if (src) setSrc(null);
    if (dst) setDst(null);
    return { setSrc, setDst, swap, isNavOpen: false };
  }

  if (srcError || dstError) {
    toast.error(srcError || dstError);
    if (src) setSrc(null);
    if (dst) setDst(null);
    return { setSrc, setDst, swap, isNavOpen: false };
  }

  return {
    navPaths,
    isNavOpen: !!dstName,
    srcName,
    dstName,
    srcShortName,
    dstShortName,
    setSrc,
    setDst,
    swap,
  };
};

export default useNavPaths;

import { useQueryState } from "nuqs";
import { toast } from "react-toastify";
import $api from "@/api/client";
import $rapi from "@/api/rustClient";
import useBoundStore from "@/store";
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
): {
  query?: string;
  label?: string;
  labelShort?: string;
  urlParam?: string;
  error?: string;
} => {
  const { data: buildings } = $api.useQuery("get", "/buildings");
  const pointSplit = point.split("-");
  const buildingCode = pointSplit[0];
  const roomName = pointSplit.slice(1).join("-");
  const floorName = getFloorLevelFromRoomName(roomName);
  const userPosition = useBoundStore((state) => state.userPosition);

  const floorCode =
    buildingCode && floorName ? `${buildingCode}-${floorName}` : null;
  const { data: rooms } = $api.useQuery(
    "get",
    "/floors/{floorCode}/floorplan",
    { params: { path: { floorCode: floorCode ?? "" } } },
    { enabled: !!floorCode },
  );

  if (point.includes("user")) {
    if (!userPosition) {
      return { label: "Your Location (unavailable)" };
    }
    return {
      query: `${userPosition.coords.latitude},${userPosition.coords.longitude}`,
      label: "Your Location",
      labelShort: "You",
    };
  }

  if (point === "") {
    return {};
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
    return { query: room.id, label, labelShort, urlParam: point };
  }

  // If point is not a coordinate, user position, or room name, we treat it as a building code
  if (!buildings) {
    return {};
  }

  if (!point || !buildings?.[point]) {
    return { error: `Invalid Building ${point}` };
  }

  return {
    query: point,
    label: buildings[point]?.name,
    labelShort: point,
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
    urlParam: srcUrlParam,
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
    enabled: srcQuery && dstQuery && srcQuery !== "" && dstQuery !== "",
  }) as { data: NavPaths | undefined };

  const swap = () => {
    const temp = src;
    if (srcUrlParam) {
      navigate(`/${srcUrlParam}`);
    }
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

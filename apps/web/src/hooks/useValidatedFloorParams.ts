import {  useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";

import {
  useGetFloorGraphQuery,
  useGetFloorPoisQuery,
  useGetFloorRoomsQuery,
} from "../store/api/floorDataApiSlice";
import {
  InfoDisplayTabIndex,
  setInfoDisplayActiveTabIndex,
} from "../store/features/uiSlice";

type FloorParamsResult =
  | { error: string; nodeId?: undefined; roomId?: undefined; poiId?: undefined }
  | {
      nodeId?: string | null;
      roomId?: string | null;
      poiId?: string | null;
    };

const useValidatedFloorParams = (floorCode: string): FloorParamsResult => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: graph } = useGetFloorGraphQuery(floorCode);
  const { data: rooms } = useGetFloorRoomsQuery(floorCode);
  const { data: pois } = useGetFloorPoisQuery(floorCode);

  const [searchParam] = useSearchParams();
  const nodeId = searchParam.get("nodeId");
  const roomId = searchParam.get("roomId");
  const poiId = searchParam.get("poiId");

  // set the active tab index based on the query params
  // not for node id since it is how user change url param after the initial load
  useEffect(() => {
    if (roomId) {
      dispatch(setInfoDisplayActiveTabIndex(InfoDisplayTabIndex.ROOM));
    }

    if (poiId) {
      dispatch(setInfoDisplayActiveTabIndex(InfoDisplayTabIndex.POI));
    }
  }, [dispatch, navigate, nodeId, poiId, pois, roomId]);

  const result = useMemo(() => {
    if (!graph || !pois || !rooms) {
      return {};
    }

  if (roomId && !rooms[roomId]) {
    return { error: "Invalid Room ID" };
  }

  if (poiId && !pois[poiId]) {
    return { error: "Invalid POI ID" };
  }

  if (nodeId && !graph[nodeId]) {
    return { error: "Invalid Node ID" };
  }

  if (roomId) {
    // no way to get the nodeId from the roomId since a room can have multiple nodes
    return { roomId };
  }

  if (poiId) {
    // nodeId can be the nodeId of the poi
    const nodeId = pois[poiId].nodeId;

    // roomId can be the roomId of the node
    const roomId = graph[nodeId].roomId;

    return { poiId, nodeId, roomId };
  }

  if (nodeId) {
    // poiId can be the poiId of the node
    const poiId = Object.entries(pois).find(
      (poi) => poi[1].nodeId === nodeId,
    )?.[0];

    // roomId can be the roomId of the node
    const roomId = graph[nodeId].roomId;

    return { nodeId, poiId, roomId };
    }

    return {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId, roomId, poiId]);

  return result;
};

export default useValidatedFloorParams;

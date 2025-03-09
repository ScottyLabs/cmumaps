import { useEffect } from "react";
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

const useValidatedFloorParams = (floorCode: string) => {
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
  useEffect(() => {
    if (roomId) {
      dispatch(setInfoDisplayActiveTabIndex(InfoDisplayTabIndex.ROOM));
    }

    if (poiId) {
      dispatch(setInfoDisplayActiveTabIndex(InfoDisplayTabIndex.POI));
    }

    if (nodeId) {
      dispatch(setInfoDisplayActiveTabIndex(InfoDisplayTabIndex.NODE));
    }
  }, [dispatch, navigate, nodeId, poiId, pois, roomId]);

  if (!graph || !pois || !rooms) {
    return { nodeId: null, roomId: null };
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

  return { nodeId, roomId, poiId };
};

export default useValidatedFloorParams;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";

import { ERROR_CODES } from "../../../shared/errorCode";
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

  // redirect from poi id to node id
  useEffect(() => {
    if (poiId && pois) {
      if (pois[poiId]) {
        const nodeId = pois[poiId].nodeId;
        dispatch(setInfoDisplayActiveTabIndex(InfoDisplayTabIndex.POI));
        navigate(`?nodeId=${nodeId}`);
        return;
      }

      navigate(`?errorCode=${ERROR_CODES.INVALID_POI_ID}`);
    }

    if (roomId) {
      dispatch(setInfoDisplayActiveTabIndex(InfoDisplayTabIndex.ROOM));
    }

    if (nodeId) {
      dispatch(setInfoDisplayActiveTabIndex(InfoDisplayTabIndex.NODE));
    }
  }, [dispatch, navigate, nodeId, poiId, pois, roomId]);

  if (!graph || !rooms) {
    return { nodeId: null, roomId: null };
  }

  if (nodeId && !graph[nodeId]) {
    return { error: "Invalid node ID" };
  }

  if (roomId && !rooms[roomId]) {
    return { error: "Invalid room ID" };
  }

  return { nodeId, roomId };
};

export default useValidatedFloorParams;

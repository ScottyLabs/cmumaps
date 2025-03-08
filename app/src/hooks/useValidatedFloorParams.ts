import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { ERROR_CODES } from "../../../shared/errorCode";
import {
  useGetFloorGraphQuery,
  useGetFloorRoomsQuery,
} from "../store/api/floorDataApiSlice";

const useValidatedFloorParams = (floorCode: string) => {
  const navigate = useNavigate();

  const { data: graph } = useGetFloorGraphQuery(floorCode);
  const { data: rooms } = useGetFloorRoomsQuery(floorCode);

  const [searchParam] = useSearchParams();
  const nodeId = searchParam.get("nodeId");
  const roomId = searchParam.get("roomId");
  const poiId = searchParam.get("poiId");

  // redirect from poi id to node id
  useEffect(() => {
    if (poiId && graph) {
      for (const nodeId in graph) {
        if (graph[nodeId].elementId === poiId) {
          navigate(`?nodeId=${nodeId}`);
          return;
        }
      }

      navigate(`?errorCode=${ERROR_CODES.INVALID_POI_ID}`);
    }
  }, [graph, navigate, nodeId, poiId, searchParam]);

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

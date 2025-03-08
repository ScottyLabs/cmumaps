import { useSearchParams } from "react-router";

import {
  useGetFloorGraphQuery,
  useGetFloorRoomsQuery,
} from "../store/api/floorDataApiSlice";

const useValidatedFloorParams = (floorCode: string) => {
  const { data: graph } = useGetFloorGraphQuery(floorCode);
  const { data: rooms } = useGetFloorRoomsQuery(floorCode);

  const [searchParam] = useSearchParams();
  const nodeId = searchParam.get("nodeId");
  const roomId = searchParam.get("roomId");

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

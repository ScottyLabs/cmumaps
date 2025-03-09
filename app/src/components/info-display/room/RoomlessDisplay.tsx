import { v4 as uuidv4 } from "uuid";

import { Graph, RoomInfo } from "../../../../../shared/types";
import { useUpdateNodeMutation } from "../../../store/api/nodeApiSlice";
import { useCreateRoomMutation } from "../../../store/api/roomApiSlice";
import Button from "../shared/Button";

interface Props {
  floorCode: string;
  nodeId: string;
  graph: Graph;
}

const RoomlessDisplay = ({ floorCode, nodeId, graph }: Props) => {
  const [createRoom] = useCreateRoomMutation();
  const [updateNode] = useUpdateNodeMutation();

  const handleCreateRoom = async () => {
    const roomId = uuidv4();
    const roomInfo: RoomInfo = {
      name: "",
      labelPosition: graph[nodeId].pos,
      type: "",
      displayAlias: "",
      aliases: [],
      polygon: {
        type: "Polygon",
        coordinates: [[]],
      },
    };

    const batchId = uuidv4();
    await createRoom({ floorCode, roomId, roomInfo, batchId });

    const nodeInfo = { ...graph[nodeId] };
    nodeInfo.roomId = roomId;
    await updateNode({ floorCode, nodeId, nodeInfo, batchId });
  };

  return <Button text="Create Room" handleClick={handleCreateRoom} />;
};

export default RoomlessDisplay;

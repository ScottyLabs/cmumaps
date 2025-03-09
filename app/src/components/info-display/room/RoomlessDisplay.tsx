import { v4 as uuidv4 } from "uuid";

import { Graph, RoomInfo } from "../../../../../shared/types";
import { useCreateRoomMutation } from "../../../store/api/roomApiSlice";
import Button from "../shared/Button";

interface Props {
  floorCode: string;
  nodeId: string;
  graph: Graph;
}

const RoomlessDisplay = ({ floorCode, nodeId, graph }: Props) => {
  const [createRoom] = useCreateRoomMutation();

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
    const roomNodes = [nodeId];
    await createRoom({ floorCode, roomId, roomNodes, roomInfo, batchId });
  };

  return <Button text="Create Room" handleClick={handleCreateRoom} />;
};

export default RoomlessDisplay;

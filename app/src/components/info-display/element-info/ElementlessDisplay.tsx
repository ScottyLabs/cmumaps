import { v4 as uuidv4 } from "uuid";

import { Graph, PoiInfo, RoomInfo } from "../../../../../shared/types";
import { useUpdateNodeMutation } from "../../../store/api/nodeApiSlice";
import { useCreatePoiMutation } from "../../../store/api/poiApiSlice";
import { useCreateRoomMutation } from "../../../store/api/roomApiSlice";

interface Props {
  floorCode: string;
  nodeId: string;
  graph: Graph;
}

const ElementlessDisplay = ({ floorCode, nodeId, graph }: Props) => {
  const [createRoom] = useCreateRoomMutation();
  const [createPoi] = useCreatePoiMutation();
  const [updateNode] = useUpdateNodeMutation();

  const renderButton = (text: string, handleClick: () => void) => (
    <button
      className="mr-2 rounded bg-slate-500 p-1 text-sm text-white hover:bg-slate-700"
      onClick={handleClick}
    >
      {text}
    </button>
  );

  const renderCreateRoomButton = () => {
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

    return renderButton("Create Room", handleCreateRoom);
  };

  const renderCreatePoiButton = () => {
    const handleCreatePoi = async () => {
      const poiId = uuidv4();
      const poiInfo: PoiInfo = { type: "", nodeId };
      const batchId = uuidv4();
      await createPoi({ floorCode, poiId, poiInfo, batchId });

      const nodeInfo = { ...graph[nodeId] };
      await updateNode({ floorCode, nodeId, nodeInfo, batchId });
    };

    return renderButton("Create POI", handleCreatePoi);
  };

  return (
    <div className="flex gap-2">
      {renderCreateRoomButton()}
      {renderCreatePoiButton()}
    </div>
  );
};

export default ElementlessDisplay;

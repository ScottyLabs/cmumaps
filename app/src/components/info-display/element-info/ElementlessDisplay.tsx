import { v4 as uuidv4 } from "uuid";

import { Graph, PoiType, RoomInfo } from "../../../../../shared/types";

interface Props {
  floorCode: string;
  nodeId: string;
  graph: Graph;
}

const ElementlessDisplay = ({ floorCode, nodeId, graph }: Props) => {
  const renderButton = (text: string, handleClick: () => void) => (
    <button
      className="mr-2 rounded bg-slate-500 p-1 text-sm text-white hover:bg-slate-700"
      onClick={handleClick}
    >
      {text}
    </button>
  );

  const renderCreateRoomButton = () => {
    const createRoom = async () => {
      const elementId = uuidv4();
      const newRoom: RoomInfo = {
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

      // const newNode = JSON.parse(JSON.stringify(nodes[nodeId]));
      // newNode.roomId = roomId;
      // updateNode({ floorCode, nodeId, newNode });
    };

    return renderButton("Create Room", createRoom);
  };

  const renderCreatePoiButton = () => {
    const createPoi = async () => {
      const elementId = uuidv4();
      const newPoi: PoiType = "";

      // const newNode = JSON.parse(JSON.stringify(nodes[nodeId]));
      // newNode.roomId = roomId;
      // updateNode({ floorCode, nodeId, newNode });
    };

    return renderButton("Create POI", createPoi);
  };

  return (
    <div className="flex gap-2">
      {renderCreateRoomButton()}
      {renderCreatePoiButton()}
    </div>
  );
};

export default ElementlessDisplay;

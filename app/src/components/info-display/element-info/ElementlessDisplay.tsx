import { v4 as uuidv4 } from "uuid";

import { Graph, RoomInfo } from "../../../../../shared/types";

interface Props {
  floorCode: string;
  nodeId: string;
  graph: Graph;
}

const ElementlessDisplay = ({ floorCode, nodeId, graph }: Props) => {
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

    return (
      <button
        className="mr-2 rounded bg-red-500 p-1 text-sm text-white hover:bg-red-700"
        onClick={createRoom}
      >
        Create Room
      </button>
    );
  };

  return <div>{renderCreateRoomButton()}</div>;
};

export default ElementlessDisplay;

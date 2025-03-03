import { Circle } from 'react-konva';
import { useNavigate } from 'react-router';

import { ID, NodeInfo, Nodes } from '../../../../shared/types';
import { useAppSelector } from '../../store/hooks';
import {
  ADD_DOOR_NODE,
  ADD_EDGE,
  DELETE_EDGE,
  GRAPH_SELECT,
} from '../../store/slices/modeSlice';

interface Props {
  floorCode: string;
  nodes: Nodes;
}

const NodesDisplay = ({ nodes }: Props) => {
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const nodeSize = useAppSelector((state) => state.ui.nodeSize);
  const showRoomSpecific = useAppSelector((state) => state.ui.showRoomSpecific);
  const mode = useAppSelector((state) => state.mode.mode);

  // const nodeIdHovered = useAppSelector(
  //   (state) => state.mouseEvent.nodeIdOnHover,
  // );

  // const nodeIdSelected = useAppSelector((state) =>
  //   getNodeIdSelected(state.mouseEvent),
  // );

  // const roomIdSelected = getRoomId(nodes, nodeIdSelected);
  const roomIdSelected = '';

  if (!nodes) {
    return;
  }

  const getFillColor = (nodeId: ID) => {
    // if (nodeId == nodeIdSelected) {
    //   return 'yellow';
    // }

    // if (nodeId == nodeIdHovered) {
    //   return 'cyan';
    // }

    // const hasAcrossFloorEdge =
    //   Object.values(nodes[nodeId].neighbors).filter(
    //     (neighbor) => neighbor.toFloorInfo,
    //   ).length != 0;

    // const isRoomAcrossFloorType =
    //   nodes[nodeId].roomId &&
    //   rooms[nodes[nodeId].roomId] &&
    //   EdgeTypeList.includes(rooms[nodes[nodeId].roomId].type);

    // if (isRoomAcrossFloorType) {
    //   if (hasAcrossFloorEdge) {
    //     return 'lime';
    //   } else {
    //     return 'pink';
    //   }
    // } else {
    //   if (hasAcrossFloorEdge) {
    //     return 'pink';
    //   }
    // }

    // if (
    //   rooms[nodes[nodeId].roomId] &&
    //   rooms[nodes[nodeId].roomId].polygon.coordinates[0].length == 0
    // ) {
    //   return 'red';
    // }

    // if (
    //   rooms[nodes[nodeId].roomId] &&
    //   rooms[nodes[nodeId].roomId].type == 'Inaccessible'
    // ) {
    //   return 'gray';
    // }

    return 'blue';
  };

  const handleNodeClick = (nodeId: ID) => {
    if (mode == GRAPH_SELECT) {
      navigate(`?nodeId=${nodeId}`);
    } else if (mode == ADD_EDGE) {
      // handleAddEdge(nodeId);
    } else if (mode == DELETE_EDGE) {
      // handleDeleteEdge(nodeId);
    } else if (mode == ADD_DOOR_NODE) {
      // addDoorNodeErrToast();s
    }
  };

  return Object.entries(nodes).map(
    ([nodeId, node]: [ID, NodeInfo], index: number) => {
      if (!showRoomSpecific || node.roomId === roomIdSelected) {
        return (
          <Circle
            key={index}
            x={node.pos.x}
            y={node.pos.y}
            radius={nodeSize}
            fill={getFillColor(nodeId)}
            stroke="black"
            strokeWidth={nodeSize / 4}
            // onMouseEnter={(e) => setCursor(e, 'pointer')}
            // onMouseLeave={(e) => setCursor(e, 'default')}
            onClick={() => handleNodeClick(nodeId)}
            // draggable
            // onDragStart={() => dispatch(dragNode(nodeId))}
            // onDragEnd={handleOnDragEnd(nodeId)}
            // onDragMove={handleDragMove(nodeId)}
          />
        );
      }
    },
  );
};

export default NodesDisplay;

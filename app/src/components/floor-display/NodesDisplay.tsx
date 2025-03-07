import Konva from "konva";
import { throttle } from "lodash";

import { Circle } from "react-konva";
import { useNavigate, useSearchParams } from "react-router";

import { ID, NodeInfo, Nodes, PdfCoordinate } from "../../../../shared/types";
import { CURSOR_UPDATE_RATE } from "../../hooks/useCursorTracker";
import { useUpdateNodeMutation } from "../../store/api/nodeApiSlice";
import { pushCursorInfo } from "../../store/features/liveCursor/liveCursorSlice";
import { CursorInfoOnDragNode } from "../../store/features/liveCursor/liveCursorTypes";
import {
  ADD_DOOR_NODE,
  ADD_EDGE,
  DELETE_EDGE,
  GRAPH_SELECT,
} from "../../store/features/modeSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getSocketId } from "../../store/middleware/webSocketMiddleware";
import { getCursorPos, setCursor } from "../../utils/canvasUtils";

interface Props {
  floorCode: string;
  nodes: Nodes;
  offset: PdfCoordinate;
  scale: number;
}

const NodesDisplay = ({ floorCode, nodes, offset, scale }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [updateNode] = useUpdateNodeMutation();

  const [searchParam] = useSearchParams();
  const nodeIdSelected = searchParam.get("nodeId");

  const nodeSize = useAppSelector((state) => state.ui.nodeSize);
  const showRoomSpecific = useAppSelector((state) => state.ui.showRoomSpecific);
  const mode = useAppSelector((state) => state.mode.mode);

  // const nodeIdHovered = useAppSelector(
  //   (state) => state.mouseEvent.nodeIdOnHover,
  // );

  // const roomIdSelected = getRoomId(nodes, nodeIdSelected);
  const roomIdSelected = "";

  if (!nodes) {
    return;
  }

  const getFillColor = (nodeId: ID) => {
    if (nodeId == nodeIdSelected) {
      return "yellow";
    }

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

    return "blue";
  };

  const getNodePos = (e: Konva.KonvaEventObject<DragEvent>) => {
    return {
      x: Number(e.target.x().toFixed(2)),
      y: Number(e.target.y().toFixed(2)),
    };
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

  const handleDragMove = (nodeId: string) =>
    throttle((e: Konva.KonvaEventObject<DragEvent>) => {
      getCursorPos(e, offset, scale, (cursorPos) => {
        const cursorInfo: CursorInfoOnDragNode = {
          nodeId: nodeId,
          cursorPos,
          nodePos: getNodePos(e),
        };

        const socketId = getSocketId();
        if (socketId) {
          dispatch(pushCursorInfo({ socketId, cursorInfo }));
        }
      });
    }, CURSOR_UPDATE_RATE);

  const handleOnDragEnd =
    (nodeId: ID) => (e: Konva.KonvaEventObject<DragEvent>) => {
      // dispatch(releaseNode());

      // create new node
      const nodeInfo: NodeInfo = { ...nodes[nodeId] };
      nodeInfo.pos = getNodePos(e);
      // newNode.roomId = findRoomId(rooms, newNode.pos);
      const addToHistory = true;
      updateNode({ floorCode, addToHistory, nodeId, nodeInfo });
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
            onMouseEnter={(e) => setCursor(e, "pointer")}
            onMouseLeave={(e) => setCursor(e, "default")}
            onClick={() => handleNodeClick(nodeId)}
            draggable
            // onDragStart={() => dispatch(dragNode(nodeId))}
            onDragMove={handleDragMove(nodeId)}
            onDragEnd={handleOnDragEnd(nodeId)}
          />
        );
      }
    },
  );
};

export default NodesDisplay;

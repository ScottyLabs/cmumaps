import Konva from "konva";
import { throttle } from "lodash";

import { Circle } from "react-konva";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";

import { ID, NodeInfo, Graph, PdfCoordinate } from "../../../../shared/types";
import { CURSOR_UPDATE_RATE } from "../../hooks/useCursorTracker";
import {
  useCreateEdgeMutation,
  useDeleteEdgeMutation,
} from "../../store/api/edgeApiSlice";
import { useUpdateNodeMutation } from "../../store/api/nodeApiSlice";
import { pushCursorInfo } from "../../store/features/liveCursor/liveCursorSlice";
import { CursorInfoOnDragNode } from "../../store/features/liveCursor/liveCursorTypes";
import {
  ADD_DOOR_NODE,
  ADD_EDGE,
  DELETE_EDGE,
  GRAPH_SELECT,
  setMode,
} from "../../store/features/modeSlice";
import {
  dragNode,
  releaseNode,
  setDragNodePos,
} from "../../store/features/mouseEventSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCursorPos, setCursor } from "../../utils/canvasUtils";

interface Props {
  floorCode: string;
  graph: Graph;
  offset: PdfCoordinate;
  scale: number;
}

const getNodePos = (e: Konva.KonvaEventObject<DragEvent>) => {
  return {
    x: Number(e.target.x().toFixed(2)),
    y: Number(e.target.y().toFixed(2)),
  };
};

const NodesDisplay = ({ floorCode, graph, offset, scale }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [updateNode] = useUpdateNodeMutation();
  const [createEdge] = useCreateEdgeMutation();
  const [deleteEdge] = useDeleteEdgeMutation();

  const [searchParam] = useSearchParams();
  const selectedNodeId = searchParam.get("nodeId");

  const nodeSize = useAppSelector((state) => state.ui.nodeSize);
  const showRoomSpecific = useAppSelector((state) => state.ui.showRoomSpecific);
  const mode = useAppSelector((state) => state.mode.mode);

  // const nodeIdHovered = useAppSelector(
  //   (state) => state.mouseEvent.nodeIdOnHover,
  // );

  // const roomIdSelected = getRoomId(nodes, selectedNodeId);
  const roomIdSelected = "";

  if (!graph) {
    return;
  }

  const getFillColor = (nodeId: ID) => {
    if (nodeId == selectedNodeId) {
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

  const handleAddEdge = (nodeId: ID) => {
    const validate = () => {
      // this condition should never occur because we check that idSelected is
      // selected before setting mode to ADD_EDGE
      if (!selectedNodeId) {
        return { error: "Please select a node first!" };
      }

      // Check for self-loop
      if (selectedNodeId == nodeId) {
        return { error: "No self-loop allowed!" };
      }

      // Check for multi-edge
      if (Object.keys(graph[nodeId].neighbors).includes(selectedNodeId)) {
        return { error: "Edge already existed!" };
      }

      return { valid: true, outNodeId: selectedNodeId };
    };

    const validateRes = validate();
    if (!validateRes.valid) {
      toast.error(validateRes.error);
      return;
    }

    const inNodeId = nodeId;
    const outNodeId = validateRes.outNodeId;
    const addToHistory = true;
    createEdge({ floorCode, inNodeId, outNodeId, addToHistory });
    dispatch(setMode(GRAPH_SELECT));
  };

  const handleDeleteEdge = (nodeId: ID) => {
    // this condition should never occur because we check that idSelected is
    // selected before setting mode to ADD_EDGE
    if (!selectedNodeId) {
      toast.error("Please select a node first!");
      return;
    }

    if (!Object.keys(graph[nodeId].neighbors).includes(selectedNodeId)) {
      toast.error("No edge exist between these two nodes!");
      return;
    }

    const addToHistory = true;
    const inNodeId = nodeId;
    const outNodeId = selectedNodeId;
    deleteEdge({ floorCode, inNodeId, outNodeId, addToHistory });
    dispatch(setMode(GRAPH_SELECT));
  };

  const handleNodeClick = (nodeId: ID) => {
    if (mode == GRAPH_SELECT) {
      navigate(`?nodeId=${nodeId}`);
    } else if (mode == ADD_EDGE) {
      handleAddEdge(nodeId);
    } else if (mode == DELETE_EDGE) {
      handleDeleteEdge(nodeId);
    } else if (mode == ADD_DOOR_NODE) {
      // addDoorNodeErrToast();
    }
  };

  const handleDragMove = (nodeId: string) =>
    throttle((e: Konva.KonvaEventObject<DragEvent>) => {
      getCursorPos(e, offset, scale, (cursorPos) => {
        const nodePos = getNodePos(e);
        const cursorInfo: CursorInfoOnDragNode = {
          nodeId: nodeId,
          cursorPos,
          nodePos,
        };

        dispatch(setDragNodePos(nodePos));
        dispatch(pushCursorInfo(cursorInfo));
      });
    }, CURSOR_UPDATE_RATE);

  const handleOnDragEnd =
    (nodeId: ID) => (e: Konva.KonvaEventObject<DragEvent>) => {
      // create new node
      const nodeInfo: NodeInfo = { ...graph[nodeId] };
      nodeInfo.pos = getNodePos(e);
      // newNode.roomId = findRoomId(rooms, newNode.pos);
      const addToHistory = true;
      updateNode({ floorCode, addToHistory, nodeId, nodeInfo });

      // release the node after updating the position to prevent position flickering
      dispatch(releaseNode());
    };

  return Object.entries(graph).map(
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
            onDragStart={() => dispatch(dragNode(nodeId))}
            onDragMove={handleDragMove(nodeId)}
            onDragEnd={handleOnDragEnd(nodeId)}
          />
        );
      }
    },
  );
};

export default NodesDisplay;

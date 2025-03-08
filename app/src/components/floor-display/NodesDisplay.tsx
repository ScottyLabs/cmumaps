import Konva from "konva";
import { throttle } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { Circle } from "react-konva";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";

import {
  NodeInfo,
  Graph,
  PdfCoordinate,
  Rooms,
  ValidCrossFloorEdgeTypes,
} from "../../../../shared/types";
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
import { posToRoomId } from "../../utils/roomUtils";

interface Props {
  floorCode: string;
  graph: Graph;
  rooms: Rooms;
  offset: PdfCoordinate;
  scale: number;
}

const getNodePos = (e: Konva.KonvaEventObject<DragEvent>) => {
  return {
    x: Number(e.target.x().toFixed(2)),
    y: Number(e.target.y().toFixed(2)),
  };
};

const NodesDisplay = ({ floorCode, graph, rooms, offset, scale }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [updateNode] = useUpdateNodeMutation();
  const [createEdge] = useCreateEdgeMutation();
  const [deleteEdge] = useDeleteEdgeMutation();

  const [searchParam] = useSearchParams();
  const selectedNodeId = searchParam.get("nodeId");
  const roomId = searchParam.get("roomId");

  const nodeSize = useAppSelector((state) => state.ui.nodeSize);
  const showRoomSpecific = useAppSelector((state) => state.ui.showRoomSpecific);
  const mode = useAppSelector((state) => state.mode.mode);

  if (!graph) {
    return;
  }

  const getFillColor = (nodeId: string) => {
    if (nodeId == selectedNodeId) {
      return "yellow";
    }

    const room =
      graph[nodeId].elementId &&
      graph[nodeId].type === "room" &&
      rooms[graph[nodeId].elementId];

    // colors for cross floor edges
    const isValidCrossFloorEdgeType =
      room && ValidCrossFloorEdgeTypes.includes(room.type);

    const hasAcrossFloorEdge =
      Object.values(graph[nodeId].neighbors).filter(
        (neighbor) => neighbor.outFloorCode,
      ).length != 0;

    if (isValidCrossFloorEdgeType) {
      if (hasAcrossFloorEdge) {
        return "lime";
      } else {
        return "pink";
      }
    } else {
      if (hasAcrossFloorEdge) {
        return "pink";
      }
    }

    // warning, error, and default colors

    if (room && room.type == "Inaccessible") {
      return "gray";
    }

    if (room && room.polygon.coordinates[0].length == 0) {
      return "red";
    }

    if (!graph[nodeId].elementId) {
      return "red";
    }

    return "blue";
  };

  const handleAddEdge = (nodeId: string) => {
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
    const batchId = uuidv4();
    createEdge({ floorCode, inNodeId, outNodeId, batchId });
    dispatch(setMode(GRAPH_SELECT));
  };

  const handleDeleteEdge = (nodeId: string) => {
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

    const batchId = uuidv4();
    const inNodeId = nodeId;
    const outNodeId = selectedNodeId;
    deleteEdge({ floorCode, inNodeId, outNodeId, batchId });
    dispatch(setMode(GRAPH_SELECT));
  };

  const handleNodeClick = (nodeId: string) => {
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
    (nodeId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
      // create new node
      const nodeInfo: NodeInfo = { ...graph[nodeId] };
      nodeInfo.pos = getNodePos(e);
      // locate new room id if node doesn't belong to a poi
      if (nodeInfo.type !== "poi") {
        nodeInfo.elementId = posToRoomId(nodeInfo.pos, rooms);
        if (nodeInfo.elementId) {
          nodeInfo.type = "room";
        } else {
          nodeInfo.type = null;
        }
      }
      const batchId = uuidv4();
      updateNode({ floorCode, batchId, nodeId, nodeInfo });

      // release the node after updating the position to prevent position flickering
      dispatch(releaseNode());
    };

  return Object.entries(graph).map(
    ([nodeId, node]: [string, NodeInfo], index: number) => {
      if (!showRoomSpecific || node.elementId === roomId) {
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

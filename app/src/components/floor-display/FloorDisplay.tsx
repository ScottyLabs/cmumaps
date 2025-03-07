import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

import { Stage, Layer } from "react-konva";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import { selectEditPolygon } from '../../store/slices/modeSlice';
// import { getNodeIdSelected } from '../../store/slices/mouseEventSlice';
import { NodeInfo, PdfCoordinate } from "../../../../shared/types";
import useCursorTracker from "../../hooks/useCursorTracker";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import { LIVE_CURSORS_ENABLED } from "../../settings";
import {
  useCreateNodeMutation,
  useGetFloorNodesQuery,
} from "../../store/api/nodeApiSlice";
import {
  ADD_DOOR_NODE,
  ADD_EDGE,
  ADD_NODE,
  DELETE_EDGE,
  GRAPH_SELECT,
  POLYGON_ADD_VERTEX,
  setMode,
} from "../../store/features/modeSlice";
import {
  setEditRoomLabel,
  setShowRoomSpecific,
} from "../../store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getCursorPos } from "../../utils/canvasUtils";
import LiveCursors from "../live-cursors/LiveCursors";
import ErrorDisplay from "../shared/ErrorDisplay";
import Loader from "../shared/Loader";
import NodesDisplay from "./NodesDisplay";
import OutlineDisplay from "./OutlineDisplay";

interface Props {
  floorCode: string;
  setCanPan: (canPan: boolean) => void;
  handleWheel: (evt: Konva.KonvaEventObject<WheelEvent>) => void;
  handleDragMove: (evt: Konva.KonvaEventObject<DragEvent>) => void;
  scale: number;
  offset: PdfCoordinate;
  stageRef: React.RefObject<Konva.Stage | null>;
}

const FloorDisplay = ({
  floorCode,
  setCanPan,
  handleWheel,
  handleDragMove,
  scale,
  offset,
  stageRef,
}: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: nodes, isLoading, isError } = useGetFloorNodesQuery(floorCode);

  const [createNode] = useCreateNodeMutation();

  const mode = useAppSelector((state) => state.mode.mode);
  const editRoomLabel = useAppSelector((state) => state.ui.editRoomLabel);
  // const editPolygon = useAppSelector(selectEditPolygon);

  // custom hooks
  useKeyboardShortcuts(floorCode);
  const handleMouseMove = useCursorTracker(offset, scale);

  if (isLoading) {
    return <Loader loadingText="Fetching nodes and rooms" />;
  }

  if (isError || !nodes) {
    return <ErrorDisplay errorText="Failed to fetch nodes" />;
  }

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnStage = e.target == e.target.getStage();

    // errors for each mode relative to stage clicking
    if (mode == ADD_NODE || mode == POLYGON_ADD_VERTEX) {
      if (!clickedOnStage) {
        toast.error("Click on empty space!");
        return;
      }
    } else if (mode == ADD_DOOR_NODE) {
      if (clickedOnStage) {
        // addDoorNodeErrToast();
      }
    } else if (mode == ADD_EDGE || mode == DELETE_EDGE) {
      if (clickedOnStage) {
        toast.error("Click on another node!");
        return;
      }
    }

    // create node
    if (mode == ADD_NODE) {
      getCursorPos(e, offset, scale, (pos) => {
        const nodeId = uuidv4();
        const nodeInfo: NodeInfo = {
          pos,
          neighbors: {},
          roomId: "",
          // roomId: findRoomId(rooms, pos),
        };

        const addToHistory = true;
        createNode({ floorCode, addToHistory, nodeId, nodeInfo });

        dispatch(setMode(GRAPH_SELECT));
      });
    }
    // click to unselect a room or exit polygon editing or room label editing
    else if (clickedOnStage) {
      navigate("?");
      dispatch(setShowRoomSpecific(false));
      dispatch(setEditRoomLabel(false));
      dispatch(setMode(GRAPH_SELECT));
    }
  };

  // Disable panning when dragging node, vertex, or label
  const handleOnMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    let newCanPan = true;

    // can't pan when dragging on node or vertex
    if (e.target.getClassName() === "Circle") {
      newCanPan = false;
    }

    // can't pan when dragging on label in label editing mode
    if (editRoomLabel && e.target.getClassName() === "Rect") {
      newCanPan = false;
    }

    setCanPan(newCanPan);
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseMove={handleMouseMove}
        onMouseDown={handleOnMouseDown}
        onMouseUp={() => setCanPan(true)}
        onClick={handleStageClick}
        onWheel={handleWheel}
        onDragMove={handleDragMove}
        draggable
        scaleX={scale}
        scaleY={scale}
        x={offset.x}
        y={offset.y}
        ref={stageRef}
      >
        <Layer>
          <OutlineDisplay floorCode={floorCode} />
          <NodesDisplay nodes={nodes} floorCode={floorCode} />
          {LIVE_CURSORS_ENABLED && (
            <LiveCursors floorCode={floorCode} scale={scale} />
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default FloorDisplay;

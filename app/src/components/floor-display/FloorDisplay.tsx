import Konva from "konva";

import { Stage, Layer } from "react-konva";

import { PdfCoordinate } from "../../../../shared/types";
import useCursorTracker from "../../hooks/useCursorTracker";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import useStageClickHandler from "../../hooks/useStageClickHandler";
import { LIVE_CURSORS_ENABLED } from "../../settings";
import {
  useGetFloorGraphQuery,
  useGetFloorRoomsQuery,
} from "../../store/api/floorDataApiSlice";
import { useAppSelector } from "../../store/hooks";
import LiveCursors from "../live-cursors/LiveCursors";
import ErrorDisplay from "../shared/ErrorDisplay";
import Loader from "../shared/Loader";
import EdgesDisplay from "./EdgesDisplay";
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
  const {
    data: graph,
    isFetching: isFetchingGraph,
    isError: isErrorGraph,
  } = useGetFloorGraphQuery(floorCode);
  const {
    data: rooms,
    isFetching: isFetchingRooms,
    isError: isErrorRooms,
  } = useGetFloorRoomsQuery(floorCode);

  const editRoomLabel = useAppSelector((state) => state.ui.editRoomLabel);
  // const editPolygon = useAppSelector(selectEditPolygon);

  // custom hooks
  useKeyboardShortcuts(floorCode);
  const handleStageClick = useStageClickHandler(floorCode, scale, offset);
  const handleMouseMove = useCursorTracker(offset, scale);

  // we need this for the flicker effect when refetching

  if (isFetchingGraph || isFetchingRooms) {
    return <Loader loadingText="Fetching nodes and rooms" />;
  }

  if (isErrorGraph || isErrorRooms || !graph || !rooms) {
    return <ErrorDisplay errorText="Failed to fetch nodes and rooms" />;
  }

  console.log(rooms);

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
          <EdgesDisplay graph={graph} />
          <NodesDisplay
            graph={graph}
            floorCode={floorCode}
            offset={offset}
            scale={scale}
          />
          {LIVE_CURSORS_ENABLED && (
            <LiveCursors floorCode={floorCode} scale={scale} />
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default FloorDisplay;

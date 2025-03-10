import { Graph, PdfCoordinate, Pois, Rooms } from "@cmumaps/common";
import Konva from "konva";

import { Stage, Layer } from "react-konva";

import useCursorTracker from "../../hooks/useCursorTracker";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import useStageClickHandler from "../../hooks/useStageClickHandler";
import useValidatedFloorParams from "../../hooks/useValidatedFloorParams";
import { LIVE_CURSORS_ENABLED } from "../../settings";
import { useAppSelector } from "../../store/hooks";
import LiveCursors from "../live-cursors/LiveCursors";
import EdgesDisplay from "./EdgesDisplay";
import LabelsDisplay from "./LabelsDisplay";
import NodesDisplay from "./NodesDisplay";
import OutlineDisplay from "./OutlineDisplay";
import PolygonsDisplay from "./PolygonsDisplay";
import SelectedPolygonDisplay from "./SelectedPolygonDisplay";

interface Props {
  floorCode: string;
  graph: Graph;
  rooms: Rooms;
  pois: Pois;
  setCanPan: (canPan: boolean) => void;
  handleWheel: (evt: Konva.KonvaEventObject<WheelEvent>) => void;
  handleDragMove: (evt: Konva.KonvaEventObject<DragEvent>) => void;
  scale: number;
  offset: PdfCoordinate;
  stageRef: React.RefObject<Konva.Stage | null>;
}

const FloorDisplay = ({
  floorCode,
  graph,
  rooms,
  pois,
  setCanPan,
  handleWheel,
  handleDragMove,
  scale,
  offset,
  stageRef,
}: Props) => {
  const editRoomLabel = useAppSelector((state) => state.ui.editRoomLabel);
  // const editPolygon = useAppSelector(selectEditPolygon);

  // custom hooks
  useKeyboardShortcuts(floorCode, graph, rooms);
  const { roomId } = useValidatedFloorParams(floorCode);
  const handleStageClick = useStageClickHandler(
    floorCode,
    rooms,
    scale,
    offset,
  );
  const handleMouseMove = useCursorTracker(offset, scale);

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
          <PolygonsDisplay rooms={rooms} />
          <EdgesDisplay floorCode={floorCode} graph={graph} />
          <NodesDisplay
            floorCode={floorCode}
            graph={graph}
            rooms={rooms}
            pois={pois}
            offset={offset}
            scale={scale}
          />
          {roomId && (
            <SelectedPolygonDisplay
              floorCode={floorCode}
              roomId={roomId}
              polygon={rooms[roomId].polygon}
              offset={offset}
              scale={scale}
            />
          )}
          <LabelsDisplay floorCode={floorCode} graph={graph} rooms={rooms} />
          {LIVE_CURSORS_ENABLED && (
            <LiveCursors floorCode={floorCode} scale={scale} />
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default FloorDisplay;

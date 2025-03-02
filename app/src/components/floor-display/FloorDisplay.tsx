import Konva from 'konva';

import { Stage, Layer } from 'react-konva';

import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import { useGetFloorNodesQuery } from '../../store/api/nodeApiSlice';
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import { selectEditPolygon } from '../../store/slices/modeSlice';
// import { getNodeIdSelected } from '../../store/slices/mouseEventSlice';
import { PDFCoordinate } from '../shared/types';

interface Props {
  floorCode: string;
  setCanPan: (canPan: boolean) => void;
  handleWheel: (evt: Konva.KonvaEventObject<WheelEvent>) => void;
  handleDragMove: (evt: Konva.KonvaEventObject<DragEvent>) => void;
  scale: number;
  offset: PDFCoordinate;
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
  // const dispatch = useAppDispatch();

  const { data: nodes } = useGetFloorNodesQuery(floorCode);

  useKeyboardShortcuts();

  // const mode = useAppSelector((state) => state.mode.mode);
  // const nodeIdSelected = useAppSelector((state) =>
  //   getNodeIdSelected(state.mouseEvent),
  // );

  // const showOutline = useAppSelector((state) => state.visibility.showOutline);
  // const showNodes = useAppSelector((state) => state.visibility.showNodes);
  // const showEdges = useAppSelector((state) => state.visibility.showEdges);
  // const showPolygons = useAppSelector((state) => state.visibility.showPolygons);

  // const editPolygon = useAppSelector(selectEditPolygon);
  // const editRoomLabel = useAppSelector((state) => state.ui.editRoomLabel);

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        // onMouseMove={handleMouseMove}
        // onMouseDown={handleOnMouseDown}
        onMouseUp={() => setCanPan(true)}
        // onClick={handleStageClick}
        onWheel={handleWheel}
        onDragMove={handleDragMove}
        draggable
        scaleX={scale}
        scaleY={scale}
        x={offset.x}
        y={offset.y}
        ref={stageRef}
      >
        <Layer></Layer>
      </Stage>
    </>
  );
};

export default FloorDisplay;

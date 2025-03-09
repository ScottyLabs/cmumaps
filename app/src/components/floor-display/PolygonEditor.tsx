import { Polygon } from "geojson";
import Konva from "konva";
import { throttle } from "lodash";

import React from "react";
import { Circle, Line } from "react-konva";

import { PdfCoordinate } from "../../../../shared/types";
import { CURSOR_UPDATE_RATE } from "../../hooks/useCursorTracker";
import useSavePolygonEdit from "../../hooks/useSavePolygonEdit";
import { pushCursorInfo } from "../../store/features/liveCursor/liveCursorSlice";
import { CursorInfoOnDragVertex } from "../../store/features/liveCursor/liveCursorTypes";
import {
  POLYGON_DELETE_VERTEX,
  setMode,
  POLYGON_SELECT,
} from "../../store/features/modeSlice";
import {
  releaseVertex,
  setDragNodePos,
  setDragVertexInfo,
} from "../../store/features/mouseEventSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getCursorPos,
  getDragObjectPos,
  setCursor,
} from "../../utils/canvasUtils";

interface Props {
  floorCode: string;
  roomId: string;
  polygon: Polygon;
  nodeSize: number;
  offset: PdfCoordinate;
  scale: number;
}

const PolygonEditor = ({
  floorCode,
  roomId,
  polygon,
  nodeSize,
  offset,
  scale,
}: Props) => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.mode.mode);
  const ringIndex = useAppSelector((state) => state.polygon.ringIndex);
  const savePolygonEdit = useSavePolygonEdit(floorCode, roomId);

  const handleOnDragEnd = (
    e: Konva.KonvaEventObject<DragEvent>,
    index: number,
  ) => {
    const newPolygon: Polygon = JSON.parse(JSON.stringify(polygon));
    const coords = newPolygon.coordinates[ringIndex];
    const newPos = [
      Number(e.target.x().toFixed(2)),
      Number(e.target.y().toFixed(2)),
    ];
    coords[index] = newPos;
    // first and last point need to stay the same
    if (index == 0) {
      coords[coords.length - 1] = newPos;
    }

    savePolygonEdit(newPolygon);
    dispatch(releaseVertex());
  };

  const handleClick = (index: number) => {
    if (mode == POLYGON_DELETE_VERTEX) {
      const newPolygon: Polygon = JSON.parse(JSON.stringify(polygon));
      const coords = newPolygon.coordinates[ringIndex];
      coords.splice(index, 1);

      // when deleting the first index
      if (index == 0) {
        // keep the start and end the same if there are more vertices
        if (coords.length != 1) {
          coords.push(coords[0]);
        }
        // delete the duplicate vertex if there is no more vertex
        else {
          coords.pop();
        }
      }

      savePolygonEdit(newPolygon);
      dispatch(setMode(POLYGON_SELECT));
    }
  };

  const renderLines = () => {
    const coords = polygon.coordinates[ringIndex];
    let prev = coords[0];

    const lines: React.JSX.Element[] = [];

    // skip the first point and point on drag
    coords.map((points, index) => {
      if (
        !(
          (index === 0)
          // ||
          // index === vertexOnDrag ||
          // (index + coords.length - 1) % coords.length === vertexOnDrag ||
          // special case of dragging the last coord
          // (vertexOnDrag == 0 && index == coords.length - 1)
        )
      ) {
        lines.push(
          <Line
            key={index}
            points={[...prev, ...points]}
            stroke="orange"
            strokeWidth={nodeSize / 2}
          />,
        );
      }
      prev = points;
    });

    return lines.map((line) => line);
  };

  const handleOnDragStart = (
    e: Konva.KonvaEventObject<DragEvent>,
    vertexIndex: number,
  ) => {
    const vertexPos = getDragObjectPos(e);
    dispatch(setDragVertexInfo({ roomId, ringIndex, vertexIndex, vertexPos }));
  };

  const handleDragMove = (vertexIndex: number) =>
    throttle((e: Konva.KonvaEventObject<DragEvent>) => {
      const dragVertexInfo = {
        roomId,
        ringIndex,
        vertexIndex,
        vertexPos: getDragObjectPos(e),
      };

      getCursorPos(e, offset, scale, (cursorPos) => {
        const vertexPos = getDragObjectPos(e);
        const cursorInfo: CursorInfoOnDragVertex = {
          cursorPos,
          dragVertexInfo,
        };

        dispatch(setDragNodePos(vertexPos));
        dispatch(pushCursorInfo(cursorInfo));
      });
    }, CURSOR_UPDATE_RATE);

  return (
    <>
      {renderLines()}
      {/* first and last point are the same */}
      {polygon.coordinates[ringIndex].map(
        (point, index) =>
          index !== polygon.coordinates[ringIndex].length - 1 && (
            <Circle
              key={index}
              x={point[0]}
              y={point[1]}
              radius={nodeSize}
              fill="cyan"
              strokeWidth={nodeSize / 2}
              stroke="black"
              draggable
              onMouseEnter={(e) => setCursor(e, "pointer")}
              onMouseLeave={(e) => setCursor(e, "default")}
              onDragStart={(e) => handleOnDragStart(e, index)}
              onDragMove={handleDragMove(index)}
              onDragEnd={(e) => handleOnDragEnd(e, index)}
              onClick={() => handleClick(index)}
            />
          ),
      )}
    </>
  );
};

export default PolygonEditor;

import { Polygon } from "geojson";

import { Line } from "react-konva";

import { selectEditPolygon } from "../../store/features/modeSlice";
import { useAppSelector } from "../../store/hooks";
import PolygonEditor from "./PolygonEditor";

interface Props {
  floorCode: string;
  roomId: string;
  polygon: Polygon;
}

const SelectedPolygonDisplay = ({ floorCode, roomId, polygon }: Props) => {
  const nodeSize = useAppSelector((state) => state.ui.nodeSize);
  const editPolygon = useAppSelector(selectEditPolygon);

  if (!polygon) {
    return;
  }

  if (!editPolygon) {
    return polygon.coordinates.map((coords, index) => (
      <Line
        key={index}
        points={coords.flat()}
        stroke="orange"
        strokeWidth={nodeSize / 2}
      />
    ));
  }

  return (
    <PolygonEditor
      floorCode={floorCode}
      roomId={roomId}
      polygon={polygon}
      nodeSize={nodeSize}
    />
  );
};

export default SelectedPolygonDisplay;

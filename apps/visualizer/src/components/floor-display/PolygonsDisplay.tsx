import { Rooms, Polygon, getRoomTypeDetails } from "@cmumaps/common";

import { Path } from "react-konva";
import { useNavigate } from "react-router";

import { useAppSelector } from "../../store/hooks";

interface Props {
  rooms: Rooms;
}

const PolygonsDisplay = ({ rooms }: Props) => {
  const navigate = useNavigate();
  const showPolygons = useAppSelector((state) => state.visibility.showPolygons);
  const nodeSize = useAppSelector((state) => state.ui.nodeSize);

  if (!showPolygons) {
    return;
  }

  // Convert GeoJSON polygon to SVG path string
  const geojsonToPath = (polygon: Polygon): string => {
    const [outerRing, ...holes] = polygon.coordinates;

    if (outerRing.length == 0) {
      return "";
    }

    // Convert outer ring to SVG path
    let pathString = `M ${outerRing[0][0]},${outerRing[0][1]}`;
    outerRing.slice(1).forEach(([x, y]) => {
      pathString += ` L ${x},${y}`;
    });
    pathString += " Z"; // Close the outer path

    // Convert each hole (inner rings) to SVG path
    holes.forEach((hole) => {
      if (hole.length == 0) {
        return;
      }

      pathString += ` M ${hole[0][0]},${hole[0][1]}`;
      hole.slice(1).forEach(([x, y]) => {
        pathString += ` L ${x},${y}`;
      });
      pathString += " Z"; // Close the hole path
    });

    return pathString;
  };

  return Object.entries(rooms).map(([roomId, room]) => {
    const roomColor = getRoomTypeDetails(room.type);
    return (
      <Path
        key={roomId}
        data={geojsonToPath(room.polygon)}
        stroke={roomColor.border}
        strokeWidth={nodeSize / 2}
        closed
        fill={roomColor.background}
        onClick={() => navigate(`?roomId=${roomId}`)}
      />
    );
  });
};

export default PolygonsDisplay;

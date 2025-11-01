import {
  getRoomTypeDetails,
  type Placement,
  pdfPolygonToGeoPolygon,
} from "@cmumaps/common";
import { Polygon } from "mapkit-react";
import { useGetFloorRoomsQuery } from "../../store/api/floorDataApiSlice";

interface Props {
  floorCode: string;
  placement: Placement;
}

const FloorplanOverlay = ({ floorCode, placement }: Props) => {
  const { data: rooms } = useGetFloorRoomsQuery(floorCode);

  if (!rooms || !placement) {
    return null;
  }

  return Object.entries(rooms).map(([roomName, room]) => {
    const roomColors = getRoomTypeDetails(room.type);
    const points = pdfPolygonToGeoPolygon(room.polygon, placement);
    return (
      <div key={roomName}>
        <Polygon
          points={points}
          selected={false}
          enabled={true}
          fillColor={roomColors.background}
          fillOpacity={1}
          strokeColor={roomColors.border}
          strokeOpacity={1}
          lineWidth={1}
          fillRule="nonzero"
        />
      </div>
    );
  });
};

export default FloorplanOverlay;

import { Floor } from "@cmumaps/common";
import { Polygon } from "mapkit-react";

import { useGetFloorRoomsQuery } from "@/store/features/api/apiSlice";
import { getFloorCode } from "@/utils/floorUtils";

interface Props {
  floor: Floor;
}

const FloorplanOverlay = ({ floor }: Props) => {
  const { data: rooms } = useGetFloorRoomsQuery(
    getFloorCode(floor.buildingCode, floor.level),
  );

  if (!rooms) {
    return null;
  }

  return Object.entries(rooms).map(([roomId, room]) => {
    return (
      <div key={roomId}>
        <Polygon
          points={room.points}
          //   selected={isSelected}
          enabled={true}
          //   fillColor={roomColors.background}
          fillOpacity={1}
          //   strokeColor={isSelected ? "#FFBD59" : roomColors.border}
          strokeOpacity={1}
          //   lineWidth={isSelected ? 5 : 1}
          //   onSelect={handleSelectRoom(room)}
          fillRule="nonzero"
        />
      </div>
    );
  });
};

export default FloorplanOverlay;

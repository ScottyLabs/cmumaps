import { Floor, getRoomTypeDetails } from "@cmumaps/common";
import { Annotation, Polygon } from "mapkit-react";

import RoomPin from "@/components/shared/RoomPin";
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
    const roomColors = getRoomTypeDetails(room.type);

    const pinlessRoomTypes = ["Default", "Corridors"];

    const showPin = !pinlessRoomTypes.includes(room.type); // || isSelected

    return (
      <div key={roomId}>
        <Polygon
          points={room.points}
          //   selected={isSelected}
          enabled={true}
          fillColor={roomColors.background}
          fillOpacity={1}
          strokeColor={roomColors.border}
          //   strokeColor={isSelected ? "#FFBD59" : roomColors.border}
          strokeOpacity={1}
          //   lineWidth={isSelected ? 5 : 1}
          //   onSelect={handleSelectRoom(room)}
          fillRule="nonzero"
        />
        <Annotation
          latitude={room.labelPosition.latitude}
          longitude={room.labelPosition.longitude}
          //   visible={showRoomNames || showIcon}
          displayPriority={"low"}
        >
          <div
            className="flex flex-col items-center"
            onClick={(e) => {
              //   handleSelectRoom(room)();
              e.stopPropagation();
            }}
          >
            {showPin && <RoomPin room={{ ...room, id: roomId }} />}
            {
              // TODO: Add room name and alias
              /* {(showRoomNames || room.alias) && (
              <div className="text-center text-sm leading-[1.1] tracking-wide">
                {showRoomNames && <p>{room.name}</p>}
                {room.alias && (
                  <p className="w-16 text-wrap italic">{room.alias}</p>
                )}
              </div>
            )} */
            }
          </div>
        </Annotation>
      </div>
    );
  });
};

export default FloorplanOverlay;

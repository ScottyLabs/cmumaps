import { Floor, GeoRoom, getRoomTypeDetails } from "@cmumaps/common";
import { Annotation, Polygon } from "mapkit-react";

import { useNavigate } from "react-router";

import RoomPin from "@/components/shared/RoomPin";
import { useGetFloorRoomsQuery } from "@/store/features/api/apiSlice";
import { getFloorCode } from "@/utils/floorUtils";

interface Props {
  floor: Floor;
}

const FloorplanOverlay = ({ floor }: Props) => {
  const navigate = useNavigate();

  const { data: rooms } = useGetFloorRoomsQuery(
    getFloorCode(floor.buildingCode, floor.level),
  );

  if (!rooms) {
    return null;
  }

  const handleSelectRoom = (roomName: string, room: GeoRoom) => {
    const floor = room.floor;
    navigate(`/${floor.buildingCode}-${roomName}`);
  };

  return Object.entries(rooms).map(([roomName, room]) => {
    const roomColors = getRoomTypeDetails(room.type);

    const pinlessRoomTypes = ["Default", "Corridors"];

    const showPin = !pinlessRoomTypes.includes(room.type); // || isSelected

    return (
      <div key={roomName}>
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
              handleSelectRoom(roomName, room);
              e.stopPropagation();
            }}
          >
            {showPin && <RoomPin room={{ ...room, name: roomName }} />}
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

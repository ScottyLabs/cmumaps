import { Floor, GeoRoom, getRoomTypeDetails } from "@cmumaps/common";
import { Annotation, Polygon } from "mapkit-react";

import { useNavigate } from "react-router";

import RoomPin from "@/components/shared/RoomPin";
import useLocationParams from "@/hooks/useLocationParams";
import { useGetFloorRoomsQuery } from "@/store/features/api/apiSlice";
import { CardStates, setInfoCardStatus } from "@/store/features/cardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getFloorCode } from "@/utils/floorUtils";

interface Props {
  floor: Floor;
}

const FloorplanOverlay = ({ floor }: Props) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { roomName: selectedRoomName } = useLocationParams();
  const showRoomNames = useAppSelector((state) => state.map.showRoomNames);
  const { data: rooms } = useGetFloorRoomsQuery(
    getFloorCode(floor.buildingCode, floor.level),
  );

  if (!rooms) {
    return null;
  }

  const handleSelectRoom = (roomName: string, room: GeoRoom) => {
    const floor = room.floor;
    navigate(`/${floor.buildingCode}-${roomName}`);
    dispatch(setInfoCardStatus(CardStates.HALF_OPEN));
  };

  return Object.entries(rooms).map(([roomName, room]) => {
    const isSelected = roomName == selectedRoomName;
    const roomColors = getRoomTypeDetails(room.type);
    const pinlessRoomTypes = ["Default", "Corridors"];
    const showPin = !pinlessRoomTypes.includes(room.type) || isSelected;

    const renderRoomName = () => {
      if (showRoomNames || room.alias) {
        return (
          <div className="text-center text-sm leading-[1.1] tracking-wide">
            {showRoomNames && <p>{roomName}</p>}
            {room.alias && (
              <p className="w-16 text-wrap italic">{room.alias}</p>
            )}
          </div>
        );
      }
    };

    return (
      <div key={roomName}>
        <Polygon
          points={room.points}
          selected={isSelected}
          enabled={true}
          fillColor={roomColors.background}
          fillOpacity={1}
          strokeColor={isSelected ? "#FFBD59" : roomColors.border}
          strokeOpacity={1}
          lineWidth={isSelected ? 5 : 1}
          onSelect={() => handleSelectRoom(roomName, room)}
          fillRule="nonzero"
        />
        <Annotation
          latitude={room.labelPosition.latitude}
          longitude={room.labelPosition.longitude}
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
            {renderRoomName()}
          </div>
        </Annotation>
      </div>
    );
  });
};

export default FloorplanOverlay;

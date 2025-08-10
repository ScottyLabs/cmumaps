import { type Floor, type GeoRoom, getRoomTypeDetails } from "@cmumaps/common";
import { Annotation, Polygon } from "mapkit-react";
import $api from "@/api/client";
import RoomPin from "@/components/shared/RoomPin";
import useLocationParams from "@/hooks/useLocationParams";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";
import useNavigationParams from "@/hooks/useNavigationParams";
import useBoundStore from "@/store";
import { CardStates } from "@/store/cardSlice";
import { getFloorCode } from "@/utils/floorUtils";

interface Props {
  floor: Floor;
}

const FloorplanOverlay = ({ floor }: Props) => {
  // Library hooks
  const navigate = useNavigateLocationParams();

  // Global state
  const showRoomNames = useBoundStore((state) => state.showRoomNames);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);

  // Query data
  const floorCode = getFloorCode(floor);
  const { data: rooms } = $api.useQuery(
    "get",
    "/floors/{floorCode}/floorplan",
    { params: { path: { floorCode: floorCode ?? "" } } },
    { enabled: !!floorCode },
  );

  // Custom hooks
  const { roomName: selectedRoomName } = useLocationParams();
  const { isNavOpen, setSrc } = useNavigationParams();

  if (!rooms) {
    return null;
  }

  const handleSelectRoom = (roomName: string, room: GeoRoom) => {
    const floor = room.floor;
    if (isNavOpen) {
      setSrc(`${floor.buildingCode}-${roomName}`);
    } else {
      navigate(`/${floor.buildingCode}-${roomName}`);
      setCardStatus(CardStates.HALF_OPEN);
    }
  };

  return Object.entries(rooms).map(([roomName, room]) => {
    const isSelected = roomName === selectedRoomName;
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
          <button
            type="button"
            tabIndex={0}
            className="flex flex-col items-center"
            onClick={(e) => {
              handleSelectRoom(roomName, room);
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSelectRoom(roomName, room);
                e.stopPropagation();
              }
            }}
          >
            {showPin && <RoomPin room={{ ...room, name: roomName }} />}
            {renderRoomName()}
          </button>
        </Annotation>
      </div>
    );
  });
};

export default FloorplanOverlay;

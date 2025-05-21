import { skipToken } from "@reduxjs/toolkit/query";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient";
import ButtonsRow from "@/components/info-cards/shared/buttons-row/ButtonsRow";
import InfoCardImage from "@/components/info-cards/shared/media/InfoCardImage";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import { useGetFloorRoomsQuery } from "@/store/features/api/apiSlice";
import { selectCardCollapsed } from "@/store/features/cardSlice";
import { useAppSelector } from "@/store/hooks";

const RoomCard = () => {
  const { buildingCode, roomName, floor } = useLocationParams();
  const isMobile = useIsMobile();
  const cardCollapsed = useAppSelector(selectCardCollapsed);
  const floorCode = buildingCode && floor ? `${buildingCode}-${floor}` : null;
  const { data: buildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: apiClient("buildings"),
  });
  const { data: rooms } = useGetFloorRoomsQuery(
    floorCode ? floorCode : skipToken,
  );

  if (!roomName || !rooms || !buildings) {
    return;
  }

  const room = rooms[roomName];
  if (!room) {
    return;
  }

  const renderRoomImage = () => {
    const buildingCode = room.floor.buildingCode;

    // the default image is the building image
    const url = `/location_images/building_room_images/${buildingCode}/${buildingCode}.jpg`;
    // // but get the room image if it exists
    // if (
    //   availableRoomImages &&
    //   availableRoomImages[buildingCode].includes(room.name + ".jpg")
    // ) {
    //   url = `/location_images/building_room_images/${buildingCode}/${room.name}.jpg`;
    // }
    return <InfoCardImage url={url} alt={roomName} />;
  };

  const renderRoomTitle = () => {
    const renderTitle = () => {
      if (room.alias) {
        return <h2>{room.alias}</h2>;
      }

      if (
        room.type == "Restroom" ||
        room.type == "Stairs" ||
        room.type == "Elevator"
      ) {
        return <h2>{room.type}</h2>;
      }

      return (
        <div className="flex items-center justify-between">
          <h2>
            {buildings[room.floor.buildingCode]?.name} {roomName}
          </h2>
          <p className="italic">{room.type}</p>
        </div>
      );
    };

    return (
      <div className="mx-3 mt-2">
        {renderTitle()}
        <p className="text-gray-500">No Room Schedule Available</p>
      </div>
    );
  };

  const renderButtonsRow = () => {
    return <ButtonsRow middleButton={<></>} />;
  };

  return (
    <>
      {(!cardCollapsed || !isMobile) && renderRoomImage()}
      {renderRoomTitle()}
      {renderButtonsRow()}
    </>
  );
};

export default RoomCard;

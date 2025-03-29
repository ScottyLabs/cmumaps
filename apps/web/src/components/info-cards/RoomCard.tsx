import { skipToken } from "@reduxjs/toolkit/query";

import { useEffect } from "react";

import ButtonsRow from "@/components/info-cards/ButtonsRow";
import InfoCardImage from "@/components/info-cards/InfoCardImage";
import useLocationParams from "@/hooks/useLocationParams";
import {
  useGetBuildingsQuery,
  useGetFloorRoomsQuery,
} from "@/store/features/api/apiSlice";
import { setMidSnapPoint } from "@/store/features/cardSlice";
import { useAppDispatch } from "@/store/hooks";

const RoomCard = () => {
  const dispatch = useAppDispatch();

  const { data: buildings } = useGetBuildingsQuery();
  const { buildingCode, roomName, floor } = useLocationParams();
  const floorCode = buildingCode && floor ? `${buildingCode}-${floor}` : null;
  const { data: rooms } = useGetFloorRoomsQuery(
    floorCode ? floorCode : skipToken,
  );

  // set the mid snap point
  // TODO: should change based on if has schedule
  useEffect(() => {
    dispatch(setMidSnapPoint(300));
  }, [dispatch]);

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
    const url = `/assets/location_images/building_room_images/${buildingCode}/${buildingCode}.jpg`;
    // // but get the room image if it exists
    // if (
    //   availableRoomImages &&
    //   availableRoomImages[buildingCode].includes(room.name + ".jpg")
    // ) {
    //   url = `/assets/location_images/building_room_images/${buildingCode}/${room.name}.jpg`;
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
      {renderRoomImage()}
      {renderRoomTitle()}
      {renderButtonsRow()}
    </>
  );
};

export default RoomCard;

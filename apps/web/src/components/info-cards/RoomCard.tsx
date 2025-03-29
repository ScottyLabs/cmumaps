import reserveIcon from '@icons/infocard/reserve.svg';
import Image from 'next/image';

import { useEffect, useState } from 'react';

import { getDbRoomExists } from '@/lib/apiRoutes';
import { useAppSelector } from '@/lib/hooks';
import { Room } from '@/types';

import ButtonsRow, { renderMiddleButtonHelper } from './ButtonsRow';
import InfoCardImage from './InfoCardImage';
import RoomSchedule from './RoomSchedule';

interface Props {
  room: Room;
  initSnapPoint?: (number) => void;
}

const RoomCard = ({ room, initSnapPoint }: Props) => {
  const buildings = useAppSelector((state) => state.data.buildings);
  const availableRoomImages = useAppSelector(
    (state) => state.data.availableRoomImages,
  );

  const [hasSchedule, setHasSchedule] = useState<boolean | null>(null);

  useEffect(() => {
    getDbRoomExists(room).then((response) => setHasSchedule(response));
  }, [room]);

  useEffect(() => {
    initSnapPoint?.(hasSchedule ? 423 : 320);
  }, [hasSchedule, initSnapPoint]);

  if (!buildings || hasSchedule === null) {
    return;
  }

  const renderRoomImage = () => {
    const buildingCode = room.floor.buildingCode;

    // the default image is the building image
    let url = `/assets/location_images/building_room_images/${buildingCode}/${buildingCode}.jpg`;

    // but get the room image if it exists
    if (
      availableRoomImages &&
      availableRoomImages[buildingCode].includes(room.name + '.jpg')
    ) {
      url = `/assets/location_images/building_room_images/${buildingCode}/${room.name}.jpg`;
    }

    return <InfoCardImage url={url} alt={room.name} />;
  };

  const renderRoomTitle = () => {
    const renderTitle = () => {
      if (room.alias) {
        return <h2>{room.alias}</h2>;
      }

      if (
        room.type == 'Restroom' ||
        room.type == 'Stairs' ||
        room.type == 'Elevator'
      ) {
        return <h2>{room.type}</h2>;
      }

      return (
        <div className="flex items-center justify-between">
          <h2>
            {buildings[room.floor.buildingCode].name} {room.name}
          </h2>
          <p className="italic">{room.type}</p>
        </div>
      );
    };

    if (hasSchedule) {
      return <div className="mx-3 mt-2">{renderTitle()}</div>;
    } else {
      return (
        <div className="mx-3 mt-2">
          {renderTitle()}
          <p className="text-[--color-gray]">No Room Schedule Available</p>
        </div>
      );
    }
  };

  const renderButtonsRow = () => {
    const renderMiddleButton = () => {
      if (hasSchedule) {
        const icon = <Image src={reserveIcon} alt="Reserve Icon" />;

        return renderMiddleButtonHelper(
          'Reserve Room',
          icon,
          'https://25live.collegenet.com/pro/cmu#!/home/event/form',
        );
      } else if (room.type == 'Library Study Room') {
        const icon = <Image src={reserveIcon} alt="Reserve Icon" />;

        return renderMiddleButtonHelper(
          'Reserve Study Room',
          icon,
          'https://cmu.libcal.com/r',
        );
      } else {
        return <></>;
      }
    };

    return <ButtonsRow middleButton={renderMiddleButton()} />;
  };

  return (
    <>
      {renderRoomImage()}
      {renderRoomTitle()}
      {renderButtonsRow()}
      {hasSchedule && <RoomSchedule />}
    </>
  );
};

export default RoomCard;

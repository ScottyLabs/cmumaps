import { latitudeRatio, longitudeRatio, rotate } from '@/geometry';
import {
  AbsoluteCoordinate, FloorPlan, getRoomTypeDetails, Placement, Room,
} from '@/types';
import {
  Annotation, Coordinate, Polygon,
} from 'mapkit-react';
import React, { useMemo, useRef } from 'react';
import clsx from 'clsx';
import styles from '../styles/FloorPlanOverlay.module.css';
import RoomPin, { hasIcon } from './RoomPin';

export function getFloorCenter(rooms: Room[]): AbsoluteCoordinate | undefined {
  if (!rooms) return undefined;

  const points: AbsoluteCoordinate[] = rooms.flatMap((room: Room) => room.shapes.flat());
  const allX = points.map((p) => p.x);
  const allY = points.map((p) => p.y);

  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);

  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

export function positionOnMap(
  absolute: AbsoluteCoordinate,
  placement: Placement | null,
  center: AbsoluteCoordinate | undefined,
) {
  if (placement === null) throw new Error('No active placement');
  if (!center) throw new Error('No center');

  const [absoluteY, absoluteX] = rotate(
    absolute.x - center.x,
    absolute.y - center.y,
    placement.angle,
  );

  return {
    latitude: (absoluteY / latitudeRatio) / placement.scale + placement.center.latitude,
    longitude: (absoluteX / longitudeRatio) / placement.scale + placement.center.longitude,
  };
}

interface FloorPlanOverlayProps {
  floorPlan: FloorPlan;
  showRoomNames: boolean;
  isBackground: boolean;
  toggleCard: Function;
  buildingAndRoom: any;
}

/**
 * The contents of a floor displayed on the map.
 */
export default function FloorPlanOverlay({
  floorPlan,
  showRoomNames,
  isBackground,
  toggleCard,
  buildingAndRoom,
}: FloorPlanOverlayProps) {
  const { rooms, placement } = floorPlan;

  // Compute the center position of the bounding box of the current floor
  // (Will be used as the rotation center)
  const center: (AbsoluteCoordinate | undefined) = useMemo(() => (
    getFloorCenter(rooms)
  ), [rooms]);

  const convertToMap = (absolute: AbsoluteCoordinate): Coordinate => (
    positionOnMap(absolute, placement, center)
  );

  return (
    <>
      {rooms.map((room: Room) => {
        if (room.shapes.length !== 1) {
          throw new Error('Multi-shape rooms are not supported.');
        }
        // Turn on for CMUShits.com
        // if (room.type != "restroom" && room.type != "corridor")
        //   return;
        const pointsSrc = room.shapes[0].map(convertToMap);

        const roomColors = getRoomTypeDetails(room.type);

        const labelPos = convertToMap(room.labelPosition!);

        const opacity = isBackground ? 0.7 : 1;

        const showIcon = hasIcon(room) || buildingAndRoom?.room?.id === room.id;

        return (
          <React.Fragment key={room.id}>
            <Polygon
              points={[
                ...pointsSrc,
                pointsSrc[0],
              ]}
              selected={buildingAndRoom?.room?.id === room.id}
              enabled={true}
              fillColor={roomColors.background}
              fillOpacity={opacity}
              strokeColor={buildingAndRoom?.room?.id === room.id ? "#f7efc3": roomColors.border}
              strokeOpacity={opacity}
              lineWidth={buildingAndRoom?.room?.id === room.id ? 5 : 1}
              // onSelect={()=>toggleCard(null, room, true)}
              // onDeselect={()=>toggleCard(null, room, false)}
              />

            {!isBackground && (showRoomNames || showIcon) && (
              <Annotation
                latitude={labelPos.latitude}
                longitude={labelPos.longitude}
                onSelect={()=>toggleCard(null, room, true)}
                onDeselect={()=>toggleCard(null, room, false)}
              >
                <div className={buildingAndRoom?.room?.id !== room.id ? styles.marker : styles["marker-selected"]}>
                  <RoomPin room={room} selected={buildingAndRoom} />
                  {(showRoomNames || room.alias) && (
                    <div
                      className={clsx(
                        styles.label,
                        (showIcon) && styles['label-on-icon'],
                      )}
                    >
                      {showRoomNames && (
                        <div className={styles['room-number']}>
                          {room.name}
                        </div>
                      )}
                      {room.alias && (
                        <div>{room.alias}</div>
                      )}
                    </div>
                  )}
                </div>
              </Annotation>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
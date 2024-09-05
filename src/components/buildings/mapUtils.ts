import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { Coordinate } from 'mapkit-react';

import {
  selectRoom,
  setFocusedFloor,
  setIsZooming,
  setShowRoomNames,
} from '@/lib/features/uiSlice';
import { Building, Floor, Room } from '@/types';
import prefersReducedMotion from '@/util/prefersReducedMotion';

const setIsZoomingAsync = (isZooming: boolean) => {
  return (dispatch: Dispatch) => {
    return new Promise<void>((resolve) => {
      dispatch(setIsZooming(isZooming));
      resolve();
    });
  };
};

export const zoomOnRoom = (
  map: mapkit.Map | null,
  room: Room,
  dispatch: Dispatch<UnknownAction>,
) => {
  if (!map) {
    return;
  }
  if (room) {
    dispatch(selectRoom(room));
    dispatch(setShowRoomNames(true));
    dispatch(setFocusedFloor(room.floor));

    // zoom after finish setting the floor
    setIsZoomingAsync(true)(dispatch).then(() => {
      const points = room.coordinates;
      zoomOnObject(map, points[0]);
    });
  }
};

export const zoomOnFloor = (
  map: mapkit.Map,
  buildings: Record<string, Building> | null,
  floor: Floor,
  dispatch: Dispatch<UnknownAction>,
) => {
  if (!buildings) {
    return;
  }

  // zoom after finish setting the floor
  setIsZoomingAsync(true)(dispatch).then(() => {
    dispatch(setFocusedFloor(floor));
    const points = buildings[floor.buildingCode].shapes.flat();
    zoomOnObject(map, points);
  });
};

export const zoomOnObject = (map: mapkit.Map, points: Coordinate[]) => {
  const allLat = points.map((p) => p.latitude);
  const allLon = points.map((p) => p.longitude);
  map.setRegionAnimated(
    new mapkit.BoundingRegion(
      Math.max(...allLat),
      Math.max(...allLon),
      Math.min(...allLat),
      Math.min(...allLon),
    ).toCoordinateRegion(),
    !prefersReducedMotion(),
  );
};

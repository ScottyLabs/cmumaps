import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { Coordinate } from 'mapkit-react';

import {
  selectRoom,
  setFocusedFloor,
  setIsZooming,
  setShowRoomNames,
} from '@/lib/features/uiSlice';
import { Building, Floor, FloorPlanMap, ID } from '@/types';
import prefersReducedMotion from '@/util/prefersReducedMotion';

const setIsZoomingAsync = (isZooming: boolean) => {
  return (dispatch: Dispatch) => {
    return new Promise<void>((resolve) => {
      dispatch(setIsZooming(isZooming));
      resolve();
    });
  };
};

export const getRoomIdByNameAndFloor = (
  roomName: string,
  floor: Floor,
  buildings: Record<string, Building> | null,
  floorPlanMap: FloorPlanMap,
): string | null => {
  // find the room id
  let roomId: string | null = null;

  if (!buildings || !floorPlanMap) {
    return roomId;
  }

  if (floor) {
    if (
      floorPlanMap[floor.buildingCode] &&
      floorPlanMap[floor.buildingCode][floor.level]
    ) {
      const floorPlan = floorPlanMap[floor.buildingCode][floor.level];
      for (const room of Object.values(floorPlan)) {
        if (room.name == roomName) {
          roomId = room.id;
        }
      }
    }
  }

  return roomId;
};

/**
 * Also assign the redux variables accordingly
 */
export const zoomOnRoomByName = (
  map: mapkit.Map | null,
  roomName: string,
  floor: Floor,
  buildings: Record<string, Building> | null,
  floorPlanMap: FloorPlanMap,
  dispatch: Dispatch<UnknownAction>,
) => {
  if (!map) {
    return;
  }

  const roomId = getRoomIdByNameAndFloor(
    roomName,
    floor,
    buildings,
    floorPlanMap,
  );

  if (roomId) {
    // call roomOnRoomByID
    zoomOnRoomById(map, roomId, floor, buildings, floorPlanMap, dispatch);
  }
};

export const zoomOnRoomById = (
  map: mapkit.Map | null,
  roomId: ID,
  floor: Floor,
  buildings: Record<string, Building> | null,
  floorPlanMap: FloorPlanMap,
  dispatch: Dispatch<UnknownAction>,
) => {
  if (!buildings || !map || !floorPlanMap) {
    return;
  }

  if (floor) {
    if (
      floorPlanMap[floor.buildingCode] &&
      floorPlanMap[floor.buildingCode][floor.level]
    ) {
      const floorPlan = floorPlanMap[floor.buildingCode][floor.level];
      const room = floorPlan[roomId];

      dispatch(selectRoom(room));
      dispatch(setShowRoomNames(true));
      dispatch(setFocusedFloor(floor));

      // zoom after finish setting the floor
      setIsZoomingAsync(true)(dispatch).then(() => {
        const points = floorPlan[room.id].coordinates;
        zoomOnObject(map, points[0]);
      });
    }
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

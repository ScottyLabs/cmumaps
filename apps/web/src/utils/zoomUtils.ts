import { Buildings, Floor } from "@cmumaps/common";
import { Coordinate } from "mapkit-react";

import prefersReducedMotion from "@/utils/prefersReducedMotion";

const setIsZoomingAsync =
  (setIsZooming: (isZooming: boolean) => void) => (isZooming: boolean) =>
    new Promise<void>((resolve) => {
      setIsZooming(isZooming);
      resolve();
    });

export const zoomOnFloor = (
  map: mapkit.Map,
  buildings: Buildings,
  floor: Floor,
  setIsZooming: (isZooming: boolean) => void,
) => {
  // zoom after finish setting the floor
  setIsZoomingAsync(setIsZooming)(true).then(() => {
    const shape = buildings[floor.buildingCode]?.shape;
    if (shape) {
      zoomOnObject(map, shape.flat());
    }
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

export const zoomOnPoint = (map: mapkit.Map, point: Coordinate) => {
  map.setRegionAnimated(
    new mapkit.BoundingRegion(
      point.latitude + 0.001,
      point.longitude + 0.001,
      point.latitude - 0.001,
      point.longitude - 0.001,
    ).toCoordinateRegion(),
    !prefersReducedMotion(),
  );
};

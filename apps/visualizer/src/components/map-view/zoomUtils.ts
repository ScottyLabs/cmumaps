import type { Building } from "@cmumaps/common";
import type { Coordinate } from "mapkit-react";

export const zoomOnBuilding = (map: mapkit.Map | null, building: Building) => {
  if (!map) {
    return;
  }

  const points = building.shape.flat();
  const allLat = points.map((p) => p.latitude);
  const allLon = points.map((p) => p.longitude);

  map.setRegionAnimated(
    new mapkit.BoundingRegion(
      Math.max(...allLat),
      Math.max(...allLon),
      Math.min(...allLat),
      Math.min(...allLon),
    ).toCoordinateRegion(),
  );
};

export const zoomOnPoint = (
  map: mapkit.Map,
  point: Coordinate,
  offset = 0.0001,
  setIsZooming?: (_: boolean) => void,
  setQueuedZoomRegion?: (region: mapkit.CoordinateRegion | null) => void,
) => {
  const region = new mapkit.BoundingRegion(
    point.latitude + offset,
    point.longitude + offset,
    point.latitude - offset,
    point.longitude - offset,
  ).toCoordinateRegion();

  setIsZooming?.(true);
  setQueuedZoomRegion?.(region);

  map.setRegionAnimated(region);
};

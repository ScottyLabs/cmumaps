import type { Building } from "@cmumaps/common";

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

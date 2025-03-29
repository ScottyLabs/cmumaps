// The number of meters in a degree.
import { GeoCoordinate } from "@cmumaps/common";
import { Coordinate } from "mapkit-react";

// Values computed for the Pittsburgh region using https://stackoverflow.com/a/51765950/4652564
export const latitudeRatio = 111318.8450631976;
export const longitudeRatio = 84719.3945182816;

/**
 * Determines whether a point is in a polygon
 * (Assumes Euclidian geometry)
 * Based on https://stackoverflow.com/a/29915728/4652564
 * @param vertices The vertices of the polygon
 * @param point The point
 * @returns true if the point is in the polygon; false otherwise
 */
export function isInPolygonCoordinates(
  point: Coordinate,
  vertices: GeoCoordinate[],
) {
  const x = point.longitude;
  const y = point.latitude;

  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i]!.longitude;
    const yi = vertices[i]!.latitude;
    const xj = vertices[j]!.longitude;
    const yj = vertices[j]!.latitude;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

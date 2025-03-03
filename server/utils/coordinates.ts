import type { GeoCoordinate, PdfCoordinate } from '../../shared/types.ts';

// The number of meters in a degree.
// //Values computed for the Pittsburgh region using https://stackoverflow.com/a/51765950/4652564
const latitudeRatio = 111318.8450631976;
const longitudeRatio = 84719.3945182816;

/**
 * Converts geographical coordinates (latitude/longitude) to PDF coordinates (x/y)
 * @param position - Object containing latitude and longitude
 * @param placement - Object containing center, scale, and angle
 * @param center - Tuple containing x and y coordinates of the center
 * @returns Object with x and y PDF coordinates
 */
export const geoCoordsToPdfCoords =
  (
    geoCenter: GeoCoordinate,
    pdfCenter: PdfCoordinate,
    scale: number,
    angle: number
  ) =>
  (position: GeoCoordinate): PdfCoordinate => {
    const { latitude, longitude } = position;

    // reverse the transform and scale
    const x = (longitude - geoCenter.longitude) * longitudeRatio * scale;
    const y = (latitude - geoCenter.latitude) * latitudeRatio * scale;

    // reverse the rotation
    const pos = rotate(y, x, -angle);

    // reverse the translation
    pos.x += pdfCenter.x;
    pos.y += pdfCenter.y;
    return pos;
  };

/**
 * Rotates a point around the origin by the given angle
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param angle - Angle in radians
 * @returns Tuple containing rotated x and y coordinates
 */
function rotate(x: number, y: number, angle: number): PdfCoordinate {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * x + sin * y;
  const ny = cos * y - sin * x;
  return { x: nx, y: ny };
}

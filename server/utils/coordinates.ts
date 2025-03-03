import type {
  GeoCoordinate,
  PdfCoordinate,
  Placement,
} from "../../shared/types.ts";

// The number of meters in a degree.
// //Values computed for the Pittsburgh region using https://stackoverflow.com/a/51765950/4652564
const latitudeRatio = 111318.8450631976;
const longitudeRatio = 84719.3945182816;

/**
 * Converts PDF coordinates (x/y) to geographical coordinates (latitude/longitude)
 * @param pdfCoords - Object containing x and y PDF coordinates
 * @param geoCenter - Object containing center latitude and longitude
 * @param pdfCenter - Object containing center x and y coordinates
 * @param scale - Scale factor used in the conversion
 * @param angle - Rotation angle in radians
 * @returns Object with latitude and longitude geographical coordinates
 */
export const pdfCoordsToGeoCoords =
  ({ geoCenter, pdfCenter, scale, angle }: Placement) =>
  (pdfCoords: PdfCoordinate): GeoCoordinate => {
    const { x, y } = pdfCoords;

    // Apply translation
    const translatedX = x - pdfCenter.x;
    const translatedY = y - pdfCenter.y;

    // Apply rotation
    const rotated = rotate(translatedX, translatedY, angle);

    // Apply scaling
    const scaledX = rotated.y / scale;
    const scaledY = rotated.x / scale;

    // Convert to geographical coordinates
    const longitude = scaledX / longitudeRatio + geoCenter.longitude;
    const latitude = scaledY / latitudeRatio + geoCenter.latitude;

    return { latitude, longitude };
  };

/**
 * Converts geographical coordinates (latitude/longitude) to PDF coordinates (x/y)
 * @param geoCoords - Object containing latitude and longitude
 * @param placement - Object containing center, scale, and angle
 * @param center - Tuple containing x and y coordinates of the center
 * @returns Object with x and y PDF coordinates
 */
export const geoCoordsToPdfCoords =
  ({ geoCenter, pdfCenter, scale, angle }: Placement) =>
  (geoCoords: GeoCoordinate): PdfCoordinate => {
    const { latitude, longitude } = geoCoords;

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
 * Rotates a point around the origin by the given angle clockwise
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

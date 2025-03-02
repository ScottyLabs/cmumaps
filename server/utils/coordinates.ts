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
export function geoCoordsToPdfCoords(
  position: { latitude: number; longitude: number },
  placement: {
    center: { latitude: number; longitude: number };
    scale: number;
    angle: number;
  },
  center: [number, number]
): { x: number; y: number } {
  // Extract the latitude and longitude
  const { latitude, longitude } = position;

  // Reverse the scale and center transformations
  const absolute_y =
    (latitude - placement.center.latitude) * latitudeRatio * placement.scale;
  const absolute_x =
    (longitude - placement.center.longitude) * longitudeRatio * placement.scale;

  // Reverse the rotation
  const [rotated_x, rotated_y] = rotate(
    absolute_y,
    absolute_x,
    -placement.angle
  );

  // Add the center offset
  return { x: rotated_x + center[0], y: rotated_y + center[1] };
}

/**
 * Rotates a point around the origin by the given angle
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param angle - Angle in radians
 * @returns Tuple containing rotated x and y coordinates
 */
function rotate(x: number, y: number, angle: number): [number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return [x * cos - y * sin, x * sin + y * cos];
}

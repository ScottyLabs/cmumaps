import type {
  GeoCoordinate,
  GeoNode,
  NavPathNode,
  PdfCoordinate,
  Placement,
  Polygon,
} from "../types";

// The number of meters in a degree.
// //Values computed for the Pittsburgh region using https://stackoverflow.com/a/51765950/4652564
export const LATITUDE_RATIO = 111318.8450631976;
export const LONGITUDE_RATIO = 84719.3945182816;

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
    // We have to swap x and y because in Konva the y-axis is inverted
    const { x: ry, y: rx } = rotate(translatedX, translatedY, angle);

    // Apply scaling
    const scaledX = rx * scale;
    const scaledY = ry * scale;

    // Convert to geographical coordinates
    const longitude = scaledX / LONGITUDE_RATIO + geoCenter.longitude;
    const latitude = scaledY / LATITUDE_RATIO + geoCenter.latitude;

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
    const x = ((longitude - geoCenter.longitude) * LONGITUDE_RATIO) / scale;
    const y = ((latitude - geoCenter.latitude) * LATITUDE_RATIO) / scale;

    // reverse the rotation
    // We have to swap x and y to make this function the inverse of pdfCoordsToGeoCoords
    const pos = rotate(y, x, -angle);

    // reverse the translation
    pos.x += pdfCenter.x;
    pos.y += pdfCenter.y;
    return pos;
  };

/**
 * Based on https://stackoverflow.com/a/17411276/4652564
 * Rotates a point around the origin by the given angle clockwise
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param angle - Angle in degrees
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

export const pdfPolygonToGeoPolygon = (
  pdfPolygon: Polygon,
  placement: Placement,
): GeoCoordinate[][] => {
  return pdfPolygon.coordinates.map((ring) =>
    ring.map((coords) => {
      if (coords[0] === undefined || coords[1] === undefined) {
        throw new Error("Invalid coordinates");
      }
      return pdfCoordsToGeoCoords(placement)({ x: coords[0], y: coords[1] });
    }),
  );
};

export const geoPolygonToPdfPolygon = (
  geoPolygon: GeoCoordinate[][],
  placement: Placement,
): Polygon => {
  return {
    type: "Polygon",
    coordinates: geoPolygon.map((ring) =>
      ring.map((coords) =>
        Object.values(
          geoCoordsToPdfCoords(placement)({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }),
        ),
      ),
    ),
  };
};

export const dist = (coord1: GeoCoordinate, coord2: GeoCoordinate): number => {
  const lat1 = coord1.latitude;
  const lon1 = coord1.longitude;
  const lat2 = coord2.latitude;
  const lon2 = coord2.longitude;

  const dist1 = (lat1 - lat2) * LATITUDE_RATIO;
  const dist2 = (lon1 - lon2) * LONGITUDE_RATIO;

  return Math.sqrt(dist1 ** 2 + dist2 ** 2);
};

/**
 * Calculates the angle (in degrees) between three geographic coordinates.
 * Used for turn-by-turn navigation to determine turn directions.
 *
 * @param first - The starting coordinate
 * @param second - The middle coordinate (where the turn occurs)
 * @param third - The ending coordinate
 * @returns The angle in degrees. Negative values indicate left turns, positive indicate right turns.
 */
export const calculateAngle = (
  first: GeoCoordinate,
  second: GeoCoordinate,
  third: GeoCoordinate,
): number => {
  // Convert latitude/longitude differences to meters
  const latDiff1 = (second.latitude - first.latitude) * LATITUDE_RATIO;
  const lonDiff1 = (second.longitude - first.longitude) * LONGITUDE_RATIO;
  const latDiff2 = (third.latitude - second.latitude) * LATITUDE_RATIO;
  const lonDiff2 = (third.longitude - second.longitude) * LONGITUDE_RATIO;

  const angle =
    (Math.atan2(
      latDiff1 * lonDiff2 - lonDiff1 * latDiff2,
      latDiff1 * latDiff2 + lonDiff1 * lonDiff2,
    ) *
      180) /
    Math.PI;
  return angle;
};

export const geoNodeToNavPathNode = (geoNode: GeoNode): NavPathNode => {
  return {
    neighbors: geoNode.neighbors,
    coordinate: geoNode.pos,
    roomId: geoNode.roomId || "outside",
    id: geoNode.id,
    floor: geoNode.floor
      ? {
          buildingCode: geoNode.floor.buildingCode,
          level: geoNode.floor.level,
        }
      : undefined,
  };
};

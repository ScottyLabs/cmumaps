interface Coordinate {
  latitude: number;
  longitude: number;
}

export function encodeCoord(coord: Coordinate): string {
  const s = `${coord.latitude},${coord.longitude}`;
  return Buffer.from(s).toString("base64");
}

export function decodeCoord(s: string): Coordinate {
  const decoded = Buffer.from(s, "base64").toString();
  const [latitude, longitude] = decoded.split(",").map(Number);
  if (latitude === undefined || longitude === undefined) {
    throw new Error("Invalid coordinate string");
  }
  return { latitude, longitude };
}

type Coordinate = {
  latitude: number;
  longitude: number;
};

export function encodeCoord(coord: Coordinate): string {
  const s = `${coord.latitude},${coord.longitude}`;
  return Buffer.from(s).toString("base64");
}

export function decodeCoord(s: string): Coordinate {
  const decoded = Buffer.from(s, "base64").toString();
  const [latitude, longitude] = decoded.split(",").map(Number);
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return { latitude: latitude!, longitude: longitude! };
}

export interface Floor {
  buildingCode: string;
  level: string;
}

export interface FloorInfo extends Floor {
  centerX: number;
  centerY: number;
  centerLatitude: number;
  centerLongitude: number;
  scale: number;
  angle: number;
}

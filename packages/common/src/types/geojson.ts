// This file is a copy of the @types/geojson/index.d.ts file. Can't use the
// @types/geojson package because it's not compatible with the tsoa package.

export type Position = number[];

export interface Polygon {
  type: "Polygon";
  coordinates: Position[][];
}

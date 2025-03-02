import type { Node } from '@prisma/client';
import type {
  GeoCoordinate,
  Nodes,
  PdfCoordinate,
} from '../../shared/types.ts';

// The number of meters in a degree.
// //Values computed for the Pittsburgh region using https://stackoverflow.com/a/51765950/4652564
const latitudeRatio = 111318.8450631976;
const longitudeRatio = 84719.3945182816;

export const transform = (
  dbNodes: Node[],
  center: GeoCoordinate,
  scale: number,
  angle: number
): Nodes => {
  // reverse the transform and scale
  const nodes: Nodes = {};
  for (const node of dbNodes) {
    const x = (node.longitude - center.longitude) * longitudeRatio * scale;
    const y = (node.latitude - center.latitude) * latitudeRatio * scale;
    const pos = rotate(y, x, -angle);
    pos.x += 503.01;
    pos.y += 319.83000000000004;
    nodes[node.elementId] = { neighbors: {}, pos, roomId: node.elementId };
  }

  return nodes;
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

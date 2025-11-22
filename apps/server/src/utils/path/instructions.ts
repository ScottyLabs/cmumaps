import type { GeoCoordinate, GeoNode, Instruction } from "@cmumaps/common";

const PLACEHOLDER_INSTRUCTION_DISTANCE = 42;

function calculateAngle(
  first: GeoCoordinate,
  second: GeoCoordinate,
  third: GeoCoordinate,
): number {
  const latDiff1 = (second.latitude - first.latitude) * 111318.845;
  const lonDiff1 = (second.longitude - first.longitude) * 84719.395;
  const latDiff2 = (third.latitude - second.latitude) * 111318.845;
  const lonDiff2 = (third.longitude - second.longitude) * 84719.395;

  const angle =
    (Math.atan2(
      latDiff1 * lonDiff2 - lonDiff1 * latDiff2,
      latDiff1 * latDiff2 + lonDiff1 * lonDiff2,
    ) *
      180) /
    Math.PI;
  return angle;
}

export function generateInstructions(path: GeoNode[]): Instruction[] {
  const instructions: Instruction[] = [];

  for (let i = 0; i < path.length - 2; i++) {
    const first = path[i];
    const second = path[i + 1];
    const third = path[i + 2];

    const angle = calculateAngle(first.pos, second.pos, third.pos);

    if (Math.abs(angle) >= 30 && Math.abs(angle) <= 150) {
      const action = angle < 0 ? "Left" : "Right";
      instructions.push({
        action,
        distance: PLACEHOLDER_INSTRUCTION_DISTANCE,
        node_id: second.id,
      });
    }
  }

  return instructions;
}

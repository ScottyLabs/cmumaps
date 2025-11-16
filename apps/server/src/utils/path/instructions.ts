import type { Instruction, NodeInfo, NodesRoute } from "@cmumaps/common";

function calculateAngle(
  first: NodeInfo,
  second: NodeInfo,
  third: NodeInfo,
): number {
  const latDiff1 =
    (second.coordinate.latitude - first.coordinate.latitude) * 111318.845;
  const lonDiff1 =
    (second.coordinate.longitude - first.coordinate.longitude) * 84719.395;
  const latDiff2 =
    (third.coordinate.latitude - second.coordinate.latitude) * 111318.845;
  const lonDiff2 =
    (third.coordinate.longitude - second.coordinate.longitude) * 84719.395;

  const angle =
    (Math.atan2(
      latDiff1 * lonDiff2 - lonDiff1 * latDiff2,
      latDiff1 * latDiff2 + lonDiff1 * lonDiff2,
    ) *
      180) /
    Math.PI;
  return angle;
}

export function generateInstructions(route: NodesRoute): Instruction[] {
  const path = route.path;
  const instructions: Instruction[] = [];

  for (let i = 0; i < path.length - 2; i++) {
    const first = path[i];
    const second = path[i + 1];
    const third = path[i + 2];

    const angle = calculateAngle(first, second, third);

    if (Math.abs(angle) >= 30 && Math.abs(angle) <= 150) {
      const action = angle < 0 ? "Left" : "Right";
      instructions.push({
        action,
        distance: 42,
        node_id: second.id,
      });
    }
  }

  return instructions;
}

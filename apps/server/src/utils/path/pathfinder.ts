import type {
  Graph,
  GraphPath,
  NodeInfo,
  NodesRoute,
  PreciseRoute,
  Route,
  WayPoint,
} from "@cmumaps/common";
import { calcDist, pdfCoordsToGeoCoords } from "@cmumaps/common";
import TinyQueue from "tinyqueue";
import type { Buildings } from "../../controllers/pathController";

const findClosestNeighbors = (
  targetCoord: { latitude: number; longitude: number },
  graph: Graph,
  count: number,
): Record<string, { outFloorCode?: string }> => {
  const distances: Array<{ nodeId: string; distance: number }> = [];

  for (const node of Object.values(graph)) {
    const dist = calcDist(targetCoord, node.coordinate);
    distances.push({ nodeId: node.id, distance: dist });
  }

  // Sort by distance and take the closest 'count' nodes
  distances.sort((a, b) => a.distance - b.distance);
  const closestNodes = distances.slice(0, count);

  // Convert to neighbors object format (EdgeInfo with empty objects)
  const neighbors: Record<string, { outFloorCode?: string }> = {};
  for (const { nodeId } of closestNodes) {
    neighbors[nodeId] = {};
  }

  return neighbors;
};

export const waypointToNodes = (
  waypoint: WayPoint,
  graph: Graph,
  buildings: Buildings,
) => {
  const nodes = [];
  switch (waypoint.type) {
    case "Room": {
      for (const node of Object.values(graph)) {
        if (node.roomId === waypoint.roomId) {
          nodes.push(node.id);
        }
      }
      break;
    }
    case "Coordinate": {
      const coord = waypoint.coordinate;
      let best_dist = null;
      let best_node = null;
      for (const node of Object.values(graph)) {
        const floor = node.floor;
        if (!floor) {
          continue;
        }
        const nodeGeoCoord = pdfCoordsToGeoCoords({
          geoCenter: {
            latitude: floor.centerLatitude,
            longitude: floor.centerLongitude,
          },
          pdfCenter: {
            x: floor.centerX,
            y: floor.centerY,
          },
          scale: floor.scale,
          angle: floor.angle,
        })(node.pos);
        const dist = calcDist(nodeGeoCoord, coord);
        if (best_dist === null || dist < best_dist) {
          best_dist = dist;
          best_node = node.id;
        }
      }
      if (best_node === null) {
        throw new Error("Graph should not be empty!");
      }
      nodes.push(best_node);
      break;
    }
    case "Building": {
      for (const node of Object.values(graph)) {
        if (node.floor?.buildingCode === waypoint.buildingCode) {
          nodes.push(node.id);
        }
      }
      if (nodes.length === 0) {
        const building = buildings.find(
          (x) => x.buildingCode === waypoint.buildingCode,
        );
        if (building) {
          if (graph[building.buildingCode]) {
            nodes.push(building.buildingCode);
            return nodes;
          }
          const dummyCoord = {
            latitude: building.labelLatitude,
            longitude: building.labelLongitude,
          };

          // Find 3 closest neighbors before creating the dummy node
          const neighbors = findClosestNeighbors(dummyCoord, graph, 3);

          const dummyNode: NodeInfo = {
            id: building.buildingCode,
            coordinate: dummyCoord,
            pos: {
              x: 0,
              y: 0,
            },
            neighbors,
            roomId: null,
            floor: null,
          };
          graph[dummyNode.id] = dummyNode;

          // Add the dummy node as a neighbor to each of the found neighbors (bidirectional)
          for (const neighborId of Object.keys(neighbors)) {
            const neighbor = graph[neighborId];
            if (neighbor) {
              neighbor.neighbors[dummyNode.id] = {};
            }
          }

          nodes.push(dummyNode.id);
        } else {
          console.error("Graph", JSON.stringify(graph));
          console.error(`No nodes found for building ${waypoint.buildingCode}`);
        }
      }
      break;
    }
  }
  return nodes;
};

export const findPath = (
  startNodes: string[],
  endNodes: string[],
  graph: Graph,
  outsideCostMul = 1,
): Route | null => {
  type QueueItem = { path: string[]; distance: number; addCost: number };

  // Init work list and empty explored set (shared across all start nodes)
  const pq = new TinyQueue<QueueItem>([], (a, b) => a.distance - b.distance);
  const exploredSet = new Set<string>();

  const isGoal = new Set(endNodes);

  const getGeoCoordForNode = (nodeId: string) => {
    const node = graph[nodeId];
    return pdfCoordsToGeoCoords({
      geoCenter: {
        latitude: node.coordinate.latitude,
        longitude: node.coordinate.longitude,
      },
      pdfCenter: { x: node.pos.x, y: node.pos.y },
      scale: node.floor?.scale ?? 1,
      angle: node.floor?.angle ?? 0,
    })(node.pos);
  };

  // Push all start nodes into the priority queue
  for (const nodeId of startNodes) {
    const node = graph[nodeId];
    if (!node) continue;
    pq.push({ path: [node.id], distance: 0, addCost: 0 });
  }

  // Loop until pq is empty or shortest path is found, always explore lower-cost paths first
  while (pq.length) {
    const current = pq.pop();
    if (!current) break;

    // Extract the node path and the outside penalty (add_cost)
    const curPath = current.path;
    const curAddCost = current.addCost;
    // number of nodes in path
    const pathLen = curPath.length;

    // Extracting neighbors from the most recently added node to the path
    const lastNodeId = curPath[pathLen - 1];
    const lastNode = graph[lastNodeId];
    if (!lastNode) continue;

    if (!exploredSet.has(lastNodeId)) {
      exploredSet.add(lastNodeId);
    } else {
      continue;
    }

    // Check if the popped off node is in the goal set
    // Since we're using a min-heap priority queue sorted by distance,
    // the first goal node we pop is guaranteed to be the shortest path overall
    if (isGoal.has(lastNodeId)) {
      return {
        distance: current.distance,
        path: {
          path: curPath,
          addCost: curAddCost.toString(),
        } as GraphPath,
      } as Route;
    }

    // Add neighbors
    const neighbors = lastNode.neighbors ?? {};
    for (const [neighborId] of Object.entries(neighbors)) {
      const lastNode = graph[lastNodeId];
      const nextNode = graph[neighborId];
      if (!nextNode) continue;

      const lastGeo = getGeoCoordForNode(lastNodeId);
      const nextGeo = getGeoCoordForNode(neighborId);

      let outsideAdd = 0;
      const stepDist = (() => {
        if (!lastGeo || !nextGeo) {
          // Fallback distance if placement missing (mirrors Rust's 25.0 default when dist < 0)
          return 25;
        }
        if (
          lastNode.floor &&
          nextNode.floor &&
          lastNode.floor.buildingCode === nextNode.floor.buildingCode &&
          lastNode.floor.level !== nextNode.floor.level
        ) {
          // Traveling between floors
          return 25;
        }
        const rawDist = calcDist(lastGeo, nextGeo);
        const lastIsOutside = lastNode.floor?.buildingCode === "outside";
        const nextIsOutside = nextNode.floor?.buildingCode === "outside";
        if (lastIsOutside && nextIsOutside) {
          // Calculate and track penalty cost, must be mult to penalize distance not nodes.
          outsideAdd = rawDist * (outsideCostMul - 1);
          return rawDist * outsideCostMul;
        }
        return rawDist;
      })();

      pq.push({
        path: [...curPath, neighborId],
        distance: current.distance + stepDist,
        addCost: curAddCost + outsideAdd,
      });
    }
  }

  return null;
};

const calculateAngle = (
  first: NodeInfo,
  second: NodeInfo,
  third: NodeInfo,
): number => {
  // Convert latitude difference to meters
  const latDiff1 =
    (second.coordinate.latitude - first.coordinate.latitude) *
    111318.8450631976;
  const lonDiff1 =
    (second.coordinate.longitude - first.coordinate.longitude) *
    84719.3945182816;
  const latDiff2 =
    (third.coordinate.latitude - second.coordinate.latitude) *
    111318.8450631976;
  const lonDiff2 =
    (third.coordinate.longitude - second.coordinate.longitude) *
    84719.3945182816;

  const angle =
    Math.atan2(
      latDiff1 * lonDiff2 - lonDiff1 * latDiff2,
      latDiff1 * latDiff2 + lonDiff1 * lonDiff2,
    ) *
    (180 / Math.PI);
  return angle;
};

export const getPreciseRoute = (route: NodesRoute): PreciseRoute => {
  const path = route.path;
  const instructions = [];

  // Use a sliding window of 3 nodes
  for (let i = 0; i < path.length - 2; i++) {
    const first = path[i];
    const second = path[i + 1];
    const third = path[i + 2];

    if (!first || !second || !third) {
      continue;
    }

    // Calculate the angle between the three nodes
    const angle = calculateAngle(first, second, third);

    // Filter out straight lines (angles between 30 and 150 degrees)
    if (Math.abs(angle) >= 30.0 && Math.abs(angle) <= 150.0) {
      const action = angle < 0.0 ? "Left" : "Right";
      instructions.push({
        action,
        distance: 42.0, // Placeholder for actual distance calculation
        node_id: second.id,
      });
    }
  }

  return {
    path: route,
    instructions,
  };
};

export const getRoute = (
  startNodes: string[],
  endNodes: string[],
  graph: Graph,
  outsideCostMul = 1,
): PreciseRoute => {
  const found = findPath(startNodes, endNodes, graph, outsideCostMul);
  if (!found) {
    throw new Error("No path found");
  }

  const nodePath = found.path.path
    .map((nodeId) => graph[nodeId])
    .filter((n): n is NonNullable<typeof n> => Boolean(n));
  const trueDistance = found.distance - Number(found.path.addCost);

  const nodesRoute: NodesRoute = {
    path: nodePath,
    distance: trueDistance,
  };

  return getPreciseRoute(nodesRoute);
};

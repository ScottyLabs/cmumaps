import type {
  Graph,
  GraphPath,
  NodesRoute,
  Route,
  WayPoint,
} from "@cmumaps/common";
import { calcDist, pdfCoordsToGeoCoords } from "@cmumaps/common";
import TinyQueue from "tinyqueue";

export const waypointToNodes = (waypoint: WayPoint, graph: Graph) => {
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
        console.error("Graph", JSON.stringify(graph));
        console.error(`No nodes found for building ${waypoint.buildingCode}`);
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

  const pq = new TinyQueue<QueueItem>([], (a, b) => a.distance - b.distance);
  const exploredSet = new Set<string>();

  // Seed queue with all start nodes
  for (const nodeId of startNodes) {
    pq.push({ path: [nodeId], distance: 0, addCost: 0 });
  }

  const isGoal = new Set(endNodes);

  const getGeoCoordForNode = (nodeId: string) => {
    const node = graph[nodeId];
    const floor = node?.floor;
    if (!node || !floor) return null;
    return pdfCoordsToGeoCoords({
      geoCenter: {
        latitude: floor.centerLatitude,
        longitude: floor.centerLongitude,
      },
      pdfCenter: { x: floor.centerX, y: floor.centerY },
      scale: floor.scale,
      angle: floor.angle,
    })(node.pos);
  };

  while (pq.length) {
    const current = pq.pop();
    if (!current) break;
    const curPath = current.path;
    const lastNodeId = curPath[curPath.length - 1];

    if (exploredSet.has(lastNodeId)) continue;
    exploredSet.add(lastNodeId);

    if (isGoal.has(lastNodeId)) {
      return {
        distance: current.distance,
        path: {
          path: curPath,
          addCost: current.addCost.toString(),
        } as GraphPath,
      } as Route;
    }

    const lastNode = graph[lastNodeId];
    if (!lastNode) continue;
    const neighbors = lastNode.neighbors ?? {};
    for (const [neighborId] of Object.entries(neighbors)) {
      const nextNode = graph[neighborId];
      if (!nextNode) continue;

      const lastGeo = getGeoCoordForNode(lastNodeId);
      const nextGeo = getGeoCoordForNode(neighborId);

      let stepDist: number;
      let outsideAdd = 0;
      if (!lastGeo || !nextGeo) {
        // Fallback distance if placement missing (mirrors Rust's 25.0 default when dist < 0)
        stepDist = 25;
      } else {
        const rawDist = calcDist(lastGeo, nextGeo);
        const lastIsOutside = lastNode.floor?.buildingCode === "outside";
        const nextIsOutside = nextNode.floor?.buildingCode === "outside";
        if (lastIsOutside && nextIsOutside) {
          stepDist = rawDist * outsideCostMul;
          outsideAdd = rawDist * (outsideCostMul - 1);
        } else {
          stepDist = rawDist;
        }
      }

      pq.push({
        path: [...curPath, neighborId],
        distance: current.distance + stepDist,
        addCost: current.addCost + outsideAdd,
      });
    }
  }

  return null;
};

export const getRoute = (
  startNodes: string[],
  endNodes: string[],
  graph: Graph,
  outsideCostMul = 1,
): NodesRoute => {
  const found = findPath(startNodes, endNodes, graph, outsideCostMul);
  if (!found) {
    throw new Error("No path found");
  }

  const nodePath = found.path.path
    .map((nodeId) => graph[nodeId])
    .filter((n): n is NonNullable<typeof n> => Boolean(n));
  const trueDistance = found.distance - Number(found.path.addCost);

  return {
    path: nodePath,
    distance: trueDistance,
  };
};

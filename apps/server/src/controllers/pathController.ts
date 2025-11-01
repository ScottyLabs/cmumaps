import type { Graph, PreciseRoute, WayPoint } from "@cmumaps/common";
import { geoCoordsToPdfCoords } from "@cmumaps/common";
import { Get, Query, Route } from "tsoa";
import { prisma } from "../../prisma";
import { generateInstructions } from "../utils/path/instructions";
import { getRoute, waypointToNodes } from "../utils/path/pathfinder";

@Route("/path")
export class PathController {
  @Get("/")
  public async path(
    @Query() start: string,
    @Query() end: string,
  ): Promise<Record<string, PreciseRoute>> {
    if (!start || !end) {
      throw new Error("Invalid start or end waypoint format");
    }

    // Build global graph: all nodes and their neighbors, with floor placement
    const dbNodes = await prisma.node.findMany({
      include: {
        outEdges: {
          include: {
            outNode: { select: { buildingCode: true, floorLevel: true } },
          },
        },
        floor: true,
      },
    });

    const graph: Graph = {};
    for (const node of dbNodes) {
      const neighbors: Record<string, { outFloorCode?: string }> = {};
      for (const edge of node.outEdges) {
        const out = edge.outNode;
        const outFloorCode = `${out.buildingCode ?? "outside"}-${out.floorLevel ?? "outside"}`;
        neighbors[edge.outNodeId] = {};
        if (
          out.buildingCode !== node.buildingCode ||
          out.floorLevel !== node.floorLevel
        ) {
          neighbors[edge.outNodeId].outFloorCode = outFloorCode;
        }
      }

      const floorPlacement = node.floor
        ? {
            geoCenter: {
              latitude: node.floor.centerLatitude,
              longitude: node.floor.centerLongitude,
            },
            pdfCenter: { x: node.floor.centerX, y: node.floor.centerY },
            scale: node.floor.scale,
            angle: node.floor.angle,
          }
        : null;

      const pos = floorPlacement
        ? geoCoordsToPdfCoords(floorPlacement)({
            latitude: node.latitude,
            longitude: node.longitude,
          })
        : { x: 0, y: 0 };

      graph[node.nodeId] = {
        id: node.nodeId,
        pos,
        neighbors,
        roomId: node.roomId ?? null,
        coordinate: {
          latitude: node.latitude,
          longitude: node.longitude,
        },
        floor: node.floor
          ? {
              buildingCode: node.floor.buildingCode,
              level: node.floor.floorLevel,
              centerX: node.floor.centerX,
              centerY: node.floor.centerY,
              centerLatitude: node.floor.centerLatitude,
              centerLongitude: node.floor.centerLongitude,
              scale: node.floor.scale,
              angle: node.floor.angle,
            }
          : {
              buildingCode: "outside",
              level: "1",
            },
      } as unknown as Graph[string];
    }

    // Parse waypoints
    const parseWaypoint = (s: string): WayPoint => {
      if (s.includes(",")) {
        const [latStr, lonStr] = s.split(",");
        const latitude = Number(latStr);
        const longitude = Number(lonStr);
        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
          return { type: "Coordinate", coordinate: { latitude, longitude } };
        }
      }
      if (s.length < 5) {
        return { type: "Building", buildingCode: s };
      }
      if (s.length === 36 && !s.includes(",")) {
        return { type: "Room", roomId: s };
      }
      // For now, treat unknown as room
      return { type: "Room", roomId: s };
    };

    const startWaypoint = parseWaypoint(start);
    const endWaypoint = parseWaypoint(end);

    const startNodes = waypointToNodes(startWaypoint, graph);
    const endNodes = waypointToNodes(endWaypoint, graph);

    if (startNodes.length === 0 || endNodes.length === 0) {
      const msg =
        startNodes.length === 0 && endNodes.length === 0
          ? `Could not match start or end waypoint to any nodes: ${start}, ${JSON.stringify(startWaypoint)}, ${end}, ${JSON.stringify(endWaypoint)}`
          : startNodes.length === 0
            ? `Could not match start waypoint to any nodes: ${start}, ${JSON.stringify(startWaypoint)}, ${end}, ${JSON.stringify(endWaypoint)}`
            : `Could not match end waypoint to any nodes: ${end}, ${JSON.stringify(endWaypoint)}`;
      throw new Error(msg);
    }

    const route = getRoute(startNodes, endNodes, graph, 1);
    const instructions = generateInstructions(route);
    return { Fastest: { path: route, instructions } };
  }
}

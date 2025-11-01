import type { Buildings, GeoCoordinate, RoomType } from "@cmumaps/common";
import { prisma } from "../../../prisma";
import { buildingService } from "../../services/buildingService";
import { parseQuery, type SearchIndex } from "./parse";
import type { Document, FloorPlans, RoomDocument } from "./types";

export function roomToDocument({
  id,
  name,
  buildingName,
  buildingCode,
  alias,
  labelPosition,
}: {
  id: string;
  name: string;
  buildingName: string;
  buildingCode: string;
  alias: string;
  labelPosition: GeoCoordinate;
}): { doc: RoomDocument; terms: string[] } {
  const doc: RoomDocument = {
    id,
    name_with_space: `${buildingCode} ${name}`,
    full_name_with_space: `${buildingName} ${name}`,
    label_position: labelPosition,
    _type: "room",
    alias,
    num_terms: 0,
  };
  const terms = [
    ...parseQuery(name),
    ...parseQuery(alias),
    ...parseQuery(id),
    ...parseQuery(doc.alias),
    ...parseQuery(doc.name_with_space),
    ...parseQuery(doc.full_name_with_space),
  ];
  doc.num_terms = terms.length;
  return { doc, terms };
}

export async function getFloorplans(): Promise<FloorPlans> {
  const allRooms = await prisma.room.findMany({
    include: {
      aliases: true,
    },
  });

  const floorplans: FloorPlans = {};

  for (const room of allRooms) {
    const { buildingCode, floorLevel } = room;

    // Skip rooms without building code or floor level
    if (!buildingCode || !floorLevel) continue;

    // Initialize building if not exists
    if (!floorplans[buildingCode]) {
      floorplans[buildingCode] = {};
    }

    // Initialize floor level if not exists
    if (!floorplans[buildingCode][floorLevel]) {
      floorplans[buildingCode][floorLevel] = {};
    }

    // Map room data to the expected structure
    floorplans[buildingCode][floorLevel][room.roomId] = {
      name: room.name,
      labelPosition: {
        latitude: room.labelLatitude,
        longitude: room.labelLongitude,
      },
      type: room.type as RoomType,
      id: room.roomId,
      floor: {
        buildingCode,
        level: floorLevel,
      },
      alias: room.aliases.map((a) => a.alias),
    };
  }

  return floorplans;
}

function insertTerms(index: SearchIndex, terms: string[], docId: string): void {
  // Count term frequencies
  const termFreqs = new Map<string, number>();
  for (const term of terms) {
    termFreqs.set(term, (termFreqs.get(term) || 0) + 1);
  }

  // Insert each term into the index
  for (const [term, freq] of termFreqs.entries()) {
    if (!index[term]) {
      index[term] = [];
    }
    index[term].push([docId, freq]);
  }
}

export async function buildSearchIndex(
  floorplans: FloorPlans,
  buildingMap: Buildings,
) {
  const startTime = Date.now();
  const index: SearchIndex = {};
  const documents: Record<string, Document> = {};

  // Iterate over buildings in floorplans
  for (const [buildingCode, buildingPlan] of Object.entries(floorplans)) {
    const buildingInfo = buildingMap[buildingCode];
    const buildingName = buildingInfo?.name || "Outside";

    // Iterate over floors
    for (const [floorId, roomPlan] of Object.entries(buildingPlan)) {
      // Iterate over rooms
      for (const [roomId, room] of Object.entries(roomPlan)) {
        const { doc, terms } = roomToDocument({
          id: roomId,
          name: room.name,
          buildingName,
          buildingCode,
          alias: room.alias.join(", "),
          labelPosition: room.labelPosition,
        });

        const docId = `${buildingCode}-${floorId}-${roomId}`;
        documents[docId] = doc;
        insertTerms(index, terms, docId);
      }
    }
  }

  const elapsedTime = Date.now() - startTime;
  console.log(`Search index built in ${elapsedTime}ms`);
  console.log(`Built ${Object.keys(documents).length} documents`);

  return {
    index,
    documents,
  };
}

export async function getSearchContext() {
  const [buildings, floorplans] = await Promise.all([
    buildingService.getBuildings(),
    getFloorplans(),
  ]);
  const { index, documents } = await buildSearchIndex(floorplans, buildings);
  return { index, documents, buildings, floorplans };
}

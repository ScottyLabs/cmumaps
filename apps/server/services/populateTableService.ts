// TODO: replace with biome-ignore-all when it is supported:
// https://biomejs.dev/blog/biome-v2-0-beta/#new-features

import { prisma } from "../prisma";

export const populateTableService = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  populateBuildings: async (data: any) => {
    await prisma.building.createMany({
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      data: data.map((building: any) => ({
        ...building,
        shape: JSON.parse(building.shape),
        hitbox: JSON.parse(building.hitbox),
      })),
    });
  },

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  populateFloors: async (data: any) => {
    await prisma.floor.createMany({ data });
  },

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  populateRooms: async (data: any) => {
    await prisma.room.createMany({
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      data: data.map((room: any) => ({
        ...room,
        polygon: JSON.parse(room.polygon),
      })),
    });
  },

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  populateAlias: async (data: any) => {
    await prisma.alias.createMany({ data });
  },

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  populateNodes: async (data: any) => {
    await prisma.node.createMany({ data });
  },

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  populateEdges: async (data: any) => {
    await prisma.edge.createMany({ data });
  },
};

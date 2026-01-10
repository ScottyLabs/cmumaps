// biome-ignore-all lint/suspicious/noExplicitAny: <Just for populating table>
import { prisma } from "../../prisma/index.ts";

export const populateTableService = {
  populateBuildings: async (data: any) => {
    await prisma.building.createMany({
      data: data.map((building: any) => ({
        ...building,
        shape: JSON.parse(building.shape),
        hitbox: JSON.parse(building.hitbox),
      })),
    });
  },

  populateFloors: async (data: any) => {
    await prisma.floor.createMany({ data });
  },

  populateRooms: async (data: any) => {
    await prisma.room.createMany({
      data: data.map((room: any) => ({
        ...room,
        polygon: JSON.parse(room.polygon),
      })),
    });
  },

  populateAlias: async (data: any) => {
    await prisma.alias.createMany({ data });
  },

  populateNodes: async (data: any) => {
    await prisma.node.createMany({ data });
  },

  populateEdges: async (data: any) => {
    await prisma.edge.createMany({ data });
  },
};

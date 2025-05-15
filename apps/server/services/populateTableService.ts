/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@cmumaps/db";

export const populateTableService = {
  populateBuildings: async (data: any) => {
    await prisma.building.createMany({ data });
  },

  populateFloors: async (data: any) => {
    await prisma.floor.createMany({ data });
  },

  populateRooms: async (data: any) => {
    await prisma.room.createMany({ data });
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

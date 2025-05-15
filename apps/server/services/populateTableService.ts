/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@cmumaps/db";

export const populateTableService = {
  populateBuildings: async (data: any) => {
    await prisma.building.createMany({ data });
  },

  populateFloors: async (data: any) => {
    await prisma.floor.createMany({ data });
  },
};

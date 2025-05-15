import { prisma } from "@cmumaps/db";

export const dropTablesService = {
  dropTables: async (tableNames: string[]) => {
    await prisma.$executeRaw`TRUNCATE TABLE ${tableNames.join(", ")} RESTART IDENTITY CASCADE`;
  },
};

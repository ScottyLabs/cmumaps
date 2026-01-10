import { prisma } from "../../prisma/index.ts";

export const dropTablesService = {
  dropTables: async (tableNames: string[]) => {
    const sql = `TRUNCATE TABLE ${tableNames.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE`;
    await prisma.$executeRawUnsafe(sql);
  },
};

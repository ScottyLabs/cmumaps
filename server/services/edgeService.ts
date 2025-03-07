import type { ID } from "../../shared/types";
import { prisma } from "../index.ts";

export const edgeService = {
  createEdge: async (inNodeId: ID, outNodeId: ID) => {
    await prisma.edge.create({
      data: { inNodeId, outNodeId },
    });
    await prisma.edge.create({
      data: { inNodeId: outNodeId, outNodeId: inNodeId },
    });
  },

  deleteEdge: async (inNodeId: ID, outNodeId: ID) => {
    await prisma.edge.delete({
      where: { inNodeId_outNodeId: { inNodeId, outNodeId } },
    });
    await prisma.edge.delete({
      where: {
        inNodeId_outNodeId: { inNodeId: outNodeId, outNodeId: inNodeId },
      },
    });
  },
};

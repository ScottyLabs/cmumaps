import { prisma } from "../index.ts";
import type { PoiInfo } from "../../shared/types.ts";

export const poiService = {
  createPoi: async (floorCode: string, poiId: string, poiInfo: PoiInfo) => {
    await prisma.poi.create({
      data: {
        poiId,
        type: poiInfo.type,
        nodeId: poiInfo.nodeId,
      },
    });
  },

  deletePoi: async (poiId: string) => {
    await prisma.$transaction(async (tx) => {
      await tx.poi.delete({
        where: { poiId },
      });
    });
  },

  updatePoi: async (poiId: string, poiInfo: PoiInfo) => {
    await prisma.poi.update({
      where: { poiId },
      data: poiInfo,
    });
  },
};

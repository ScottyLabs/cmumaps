import { prisma } from "../index.ts";
import type { PoiInfo, PoiType } from "../../shared/types.ts";

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
    await prisma.poi.delete({
      where: { poiId },
    });
  },

  updatePoiType: async (poiId: string, poiType: PoiType) => {
    await prisma.poi.update({
      where: { poiId },
      data: { type: poiType },
    });
  },
};

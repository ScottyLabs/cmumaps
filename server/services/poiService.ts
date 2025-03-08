import { prisma } from "../index.ts";
import type { PoiType } from "../../shared/types.ts";
import {
  extractBuildingCode,
  extractFloorLevel,
} from "../../shared/utils/floorCodeUtils.ts";

export const poiService = {
  createPoi: async (floorCode: string, elementId: string, poiType: PoiType) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    await prisma.element.create({
      data: {
        elementId,
        type: poiType,
        buildingCode,
        floorLevel,
        poi: {
          create: {},
        },
      },
    });
  },

  deletePoi: async (elementId: string) => {
    await prisma.element.delete({
      where: { elementId },
      include: { poi: true },
    });
  },

  updatePoi: async (elementId: string, poiType: PoiType) => {
    await prisma.element.update({
      where: { elementId },
      data: { type: poiType },
    });
  },
};

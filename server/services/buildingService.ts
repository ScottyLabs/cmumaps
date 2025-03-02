import { prisma } from '../index.ts';
import { INVALID_BUILDING_CODE } from '../../shared/errorCode.ts';
import { BuildingError } from '../errors/error.ts';

export const buildingService = {
  async getAllBuildingCodesAndNames() {
    const buildings = await prisma.building.findMany({
      select: { buildingCode: true, name: true },
    });
    return buildings.sort((a, b) => a.name.localeCompare(b.name));
  },

  async getDefaultFloor(buildingCode: string) {
    const building = await prisma.building.findUnique({
      where: { buildingCode },
      select: { defaultFloor: true },
    });

    if (!building) {
      throw new BuildingError(INVALID_BUILDING_CODE);
    }

    return building.defaultFloor;
  },

  async getBuildingFloors(buildingCode: string) {
    const floorCodeOrder = [
      'PH',
      '9',
      '8',
      '7',
      '6',
      '5',
      '4',
      '3',
      '2',
      'M',
      '1',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'LL',
      'EV',
    ];

    const floors = await prisma.floor.findMany({
      where: { buildingCode },
      select: { floorLevel: true },
    });

    const floorLevelSort = (f1: string, f2: string) => {
      return floorCodeOrder.indexOf(f2) - floorCodeOrder.indexOf(f1);
    };

    return floors.map((floor) => floor.floorLevel).sort(floorLevelSort);
  },
};

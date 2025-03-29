import { Building, Floor } from "@cmumaps/common";

export const getFloorOrdinal = (building: Building, floor: Floor) => {
  const defaultIndex = building.floors.indexOf(building.defaultFloor);
  const focusedIndex = building.floors.indexOf(floor.level);
  return (building?.defaultOrdinal || 0) + focusedIndex - defaultIndex;
};

export const getFloorByOrdinal = (
  building: Building,
  ordinal: number,
): Floor | null => {
  const ordinalDif = ordinal - (building.defaultOrdinal || 0);
  const defaultIndex = building.floors.indexOf(building.defaultFloor);
  const floorIndex = defaultIndex + ordinalDif;

  if (!building.floors[floorIndex]) {
    return null;
  }

  return {
    buildingCode: building.code,
    level: building.floors[floorIndex],
  };
};

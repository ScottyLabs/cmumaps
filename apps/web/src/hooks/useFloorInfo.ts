import {
  extractBuildingCode,
  extractFloorLevel,
} from "@cmumaps/common";

const useFloorInfo = (floorCode: string) => {
  const buildingCode = extractBuildingCode(floorCode);
  const floorLevel = extractFloorLevel(floorCode);

  return { buildingCode, floorLevel };
};

export default useFloorInfo;

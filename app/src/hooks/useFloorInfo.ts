import {
  extractBuildingCode,
  extractFloorLevel,
} from "../../../shared/utils/floorCodeUtils";

const useFloorInfo = (floorCode: string) => {
  const buildingCode = extractBuildingCode(floorCode);
  const floorLevel = extractFloorLevel(floorCode);

  return { buildingCode, floorLevel };
};

export default useFloorInfo;

import BuildingShape from "@/components/map-display/buildings-display/BuildingShape";
import { useGetBuildingInfosQuery } from "@/store/features/api/apiSlice";

const BuildingsDisplay = () => {
  const { data: buildingInfos } = useGetBuildingInfosQuery();

  if (!buildingInfos) {
    return;
  }

  return buildingInfos.map((buildingInfo) => (
    <BuildingShape key={buildingInfo.code} buildingInfo={buildingInfo} />
  ));
};

export default BuildingsDisplay;

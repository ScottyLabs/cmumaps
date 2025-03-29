import BuildingRoundel from "@/components/map-display/buildings-display/BuildingRoundel";
import BuildingShape from "@/components/map-display/buildings-display/BuildingShape";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";

const BuildingsDisplay = () => {
  const { data: buildings } = useGetBuildingsQuery();

  if (!buildings) {
    return;
  }

  return buildings.map((building) => (
    <div key={building.code}>
      <BuildingShape building={building} />
      <BuildingRoundel building={building} />
    </div>
  ));
};

export default BuildingsDisplay;

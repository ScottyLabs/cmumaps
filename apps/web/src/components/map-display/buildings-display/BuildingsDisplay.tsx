import BuildingRoundel from "@/components/map-display/buildings-display/BuildingRoundel";
import BuildingShape from "@/components/map-display/buildings-display/BuildingShape";
import type { Buildings } from "@cmumaps/common";

interface Props {
  map: mapkit.Map | null;
  buildings: Buildings | undefined;
}

const BuildingsDisplay = ({ map, buildings }: Props) => {
  if (!buildings) {
    return;
  }

  return Object.values(buildings).map((building) => (
    <div key={building.code}>
      <BuildingShape building={building} />
      <BuildingRoundel map={map} building={building} />
    </div>
  ));
};

export default BuildingsDisplay;

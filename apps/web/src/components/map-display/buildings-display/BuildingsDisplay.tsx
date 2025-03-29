import { Buildings } from "@cmumaps/common";

import BuildingRoundel from "@/components/map-display/buildings-display/BuildingRoundel";
import BuildingShape from "@/components/map-display/buildings-display/BuildingShape";

interface Props {
  buildings: Buildings | undefined;
}

const BuildingsDisplay = ({ buildings }: Props) => {
  if (!buildings) {
    return;
  }

  return Object.values(buildings).map((building) => (
    <div key={building.code}>
      <BuildingShape building={building} />
      <BuildingRoundel building={building} />
    </div>
  ));
};

export default BuildingsDisplay;

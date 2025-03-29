import { Building } from "@cmumaps/common";
import { Annotation } from "mapkit-react";

import Roundel from "@/components/shared/Roundel";

interface Props {
  building: Building;
}

const BuildingRoundel = ({ building }: Props) => {
  // TODO: Don't show when it is the focused floor

  return (
    <div className="translate-y-1/2 cursor-pointer">
      <Annotation
        latitude={building.labelLatitude}
        longitude={building.labelLongitude}
      >
        <div
          className="translate-y-1/2 cursor-pointer"
          onClick={(e) => {
            // handleSelectBuilding();
            e.stopPropagation();
          }}
        >
          <Roundel code={building.code} />
        </div>
      </Annotation>
    </div>
  );
};

export default BuildingRoundel;

import type { Building } from "@cmumaps/common";
import { Annotation } from "mapkit-react";
import Roundel from "@/components/map-view/building-display/Roundel";

interface Props {
  building: Building;
}

const BuildingRoundel = ({ building }: Props) => {
  return (
    <div className="translate-y-1/2 cursor-pointer">
      <Annotation
        latitude={building.labelLatitude}
        longitude={building.labelLongitude}
        displayPriority="required"
      >
        <Roundel code={building.code} />
      </Annotation>
    </div>
  );
};

export default BuildingRoundel;

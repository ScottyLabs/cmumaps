import type { Placement } from "@cmumaps/common";
import { Annotation } from "mapkit-react";

const CenterPin = ({ placement }: { placement: Placement }) => {
  return (
    <Annotation
      latitude={placement.geoCenter.latitude}
      longitude={placement.geoCenter.longitude}
      displayPriority="required"
    >
      <p>Center</p>
    </Annotation>
  );
};

export default CenterPin;

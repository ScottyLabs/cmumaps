import type { Building } from "@cmumaps/common";
import { Polygon } from "mapkit-react";

interface Props {
  building: Building | undefined;
}

const BuildingDisplay = ({ building }: Props) => {
  if (!building) {
    return null;
  }

  return (
    <Polygon
      key={building.code}
      points={building.shape}
      enabled={false}
      strokeColor={"#6b7280"}
      fillColor={"#9ca3af"}
      fillOpacity={0.6}
      lineWidth={1}
    />
  );
};

export default BuildingDisplay;

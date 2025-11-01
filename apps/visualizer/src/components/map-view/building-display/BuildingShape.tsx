import type { Building } from "@cmumaps/common";
import { Polygon } from "mapkit-react";

interface Props {
  building: Building;
}

const BuildingShape = ({ building }: Props) => {
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

export default BuildingShape;

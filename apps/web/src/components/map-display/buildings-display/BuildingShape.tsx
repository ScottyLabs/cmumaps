import { Building } from "@cmumaps/common";
import { Polygon } from "mapkit-react";

interface Props {
  building: Building;
}

const BuildingShape = ({ building }: Props) => {
  return <Polygon points={building.shape} enabled={false} />;
};

export default BuildingShape;

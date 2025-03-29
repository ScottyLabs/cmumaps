import { BuildingInfo } from "@cmumaps/common";
import { Polygon } from "mapkit-react";

interface Props {
  buildingInfo: BuildingInfo;
}

const BuildingShape = ({ buildingInfo }: Props) => {
  return <Polygon points={buildingInfo.shape} enabled={false} />;
};

export default BuildingShape;

import { Building } from "@cmumaps/common";
import { Polygon } from "mapkit-react";

import { getBuildingShapeFillColor } from "@/components/map-display/buildings-display/colorUtils";
import useBoundStore from "@/store";

interface Props {
  building: Building;
}

const BuildingShape = ({ building }: Props) => {
  const selectedBuilding = useBoundStore((state) => state.selectedBuilding);
  const isSelected = selectedBuilding?.code == building.code;

  const getStrokeColor = () => {
    const selectedStrokeColor = "#FFBD59";
    const notSelectedColor = "#6b7280";

    if (isSelected) {
      return selectedStrokeColor;
    } else {
      return notSelectedColor;
    }
  };

  const getFillColor = () => {
    const fillColor = getBuildingShapeFillColor(building.code);
    if (fillColor) {
      return fillColor;
    } else if (!building.isMapped) {
      // fill color for unmapped buildings
      return "#6b7280";
    } else {
      // default fill color
      return "#9ca3af";
    }
  };

  const getFillOpacity = () => {
    const fillColor = getBuildingShapeFillColor(building.code);
    // TODO: need a lighter opacity for those buildings ???
    if (fillColor) {
      if (isSelected) {
        return 1;
      } else {
        return 0.8;
      }
    } else {
      if (isSelected) {
        return 1;
      } else {
        return 0.6;
      }
    }
  };

  return (
    <Polygon
      points={building.shape}
      enabled={false}
      strokeColor={getStrokeColor()}
      fillColor={getFillColor()}
      fillOpacity={getFillOpacity()}
      lineWidth={isSelected ? 3 : 1}
    />
  );
};

export default BuildingShape;

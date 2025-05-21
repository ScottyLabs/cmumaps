import { Building, extractBuildingCode } from "@cmumaps/common";
import { Annotation } from "mapkit-react";

import { useLocation, useNavigate } from "react-router";

import Roundel from "@/components/shared/Roundel";
import useMapStore from "@/store/roomSlice";
import useUiStore, { CardStates } from "@/store/searchSlice";
import { zoomOnObject } from "@/utils/zoomUtils";

interface Props {
  map: mapkit.Map | null;
  building: Building;
}

const BuildingRoundel = ({ map, building }: Props) => {
  const navigate = useNavigate();

  const location = useLocation();
  const floorCode = location.pathname.split("/")[1];
  const selectBuilding = useMapStore((state) => state.selectBuilding);
  const setCardStatus = useUiStore((state) => state.setCardStatus);

  const focusedFloor = useMapStore((state) => state.focusedFloor);
  if (focusedFloor || !map) {
    return null;
  }

  const handleClick = () => {
    // zoom on building if it's already selected
    if (floorCode) {
      const buildingCode = extractBuildingCode(floorCode);
      if (buildingCode == building.code) {
        zoomOnObject(map, building.shape.flat());
      }
    }

    navigate(`/${building.code}`);
    selectBuilding(building);
    setCardStatus(CardStates.HALF_OPEN);
  };

  return (
    <div className="translate-y-1/2 cursor-pointer">
      <Annotation
        latitude={building.labelLatitude}
        longitude={building.labelLongitude}
        displayPriority="required"
      >
        <div
          className="translate-y-1/2 cursor-pointer"
          onClick={(e) => {
            handleClick();
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

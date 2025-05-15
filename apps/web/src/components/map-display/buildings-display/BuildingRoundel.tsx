import { Building, extractBuildingCode } from "@cmumaps/common";
import { Annotation } from "mapkit-react";

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import Roundel from "@/components/shared/Roundel";
import { CardStates, setInfoCardStatus } from "@/store/features/cardSlice";
import { selectBuilding } from "@/store/features/mapSlice";
import { useAppSelector } from "@/store/hooks";
import { zoomOnObject } from "@/utils/zoomUtils";

interface Props {
  map: mapkit.Map | null;
  building: Building;
}

const BuildingRoundel = ({ map, building }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const floorCode = location.pathname.split("/")[1];

  const focusedFloor = useAppSelector((state) => state.map.focusedFloor);
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
    dispatch(selectBuilding(building));
    dispatch(setInfoCardStatus(CardStates.HALF_OPEN));
  };

  return (
    <div className="translate-y-1/2 cursor-pointer">
      <Annotation
        latitude={building.labelLatitude}
        longitude={building.labelLongitude}
        displayPriority="high"
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

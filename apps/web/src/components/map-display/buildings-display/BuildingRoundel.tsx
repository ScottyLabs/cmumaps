import { type Building, extractBuildingCode } from "@cmumaps/common";
import { Annotation } from "mapkit-react";
import { useLocation, useNavigate } from "react-router";
import Roundel from "@/components/shared/Roundel";
import useBoundStore from "@/store";
import { CardStates } from "@/store/cardSlice";
import { zoomOnObject } from "@/utils/zoomUtils";

interface Props {
  map: mapkit.Map | null;
  building: Building;
}

const BuildingRoundel = ({ map, building }: Props) => {
  const navigate = useNavigate();

  const location = useLocation();
  const floorCode = location.pathname.split("/")[1];
  const selectBuilding = useBoundStore((state) => state.selectBuilding);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);

  const focusedFloor = useBoundStore((state) => state.focusedFloor);
  if (focusedFloor || !map) {
    return null;
  }

  const handleClick = () => {
    // zoom on building if it's already selected
    if (floorCode) {
      const buildingCode = extractBuildingCode(floorCode);
      if (buildingCode === building.code) {
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
        <button
          type="button"
          className="translate-y-1/2 cursor-pointer"
          onClick={(e) => {
            handleClick();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick();
              e.stopPropagation();
            }
          }}
        >
          <Roundel code={building.code} />
        </button>
      </Annotation>
    </div>
  );
};

export default BuildingRoundel;

import { Building } from "@cmumaps/common";
import { Annotation } from "mapkit-react";

import { useDispatch } from "react-redux";

import Roundel from "@/components/shared/Roundel";
import { selectBuilding } from "@/store/features/mapUiSlice";

interface Props {
  building: Building;
}

const BuildingRoundel = ({ building }: Props) => {
  const dispatch = useDispatch();

  // TODO: Don't show when it is the buidling on focus
  return (
    <div className="translate-y-1/2 cursor-pointer">
      <Annotation
        latitude={building.labelLatitude}
        longitude={building.labelLongitude}
      >
        <div
          className="translate-y-1/2 cursor-pointer"
          onClick={(e) => {
            dispatch(selectBuilding(building));
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

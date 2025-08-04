import type { Building, Floor } from "@cmumaps/common";
import { useState } from "react";
import DefaultView from "@/components/floor-switcher/desktop/DefaultView";
import FloorPicker from "@/components/floor-switcher/desktop/FloorPicker";
import RoundelButton from "@/components/floor-switcher/desktop/RoundelButton";

interface Props {
  building: Building;
  floor: Floor;
}

const FloorSwitcherDisplayDesktop = ({ building, floor }: Props) => {
  const [showFloorPicker, setShowFloorPicker] = useState<boolean>(false);

  return (
    <div className="btn-shadow flex rounded bg-white">
      <RoundelButton building={building} />
      {showFloorPicker ? (
        <FloorPicker
          building={building}
          floor={floor}
          setShowFloorPicker={setShowFloorPicker}
        />
      ) : (
        <DefaultView
          building={building}
          floor={floor}
          setShowFloorPicker={setShowFloorPicker}
        />
      )}
    </div>
  );
};

export default FloorSwitcherDisplayDesktop;

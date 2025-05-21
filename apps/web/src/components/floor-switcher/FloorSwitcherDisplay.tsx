import { Building, Floor } from "@cmumaps/common";

import { useState } from "react";

import DefaultView from "@/components/floor-switcher/DefaultView";
import FloorPicker from "@/components/floor-switcher/FloorPicker";
import RoundelButton from "@/components/floor-switcher/RoundelButton";

interface Props {
  building: Building;
  floor: Floor;
}

/**
 * This component allows an user to switch between floors of a building.
 * Note: handles only the display logic.
 */
const FloorSwitcherDisplay = ({ building, floor }: Props) => {
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

export default FloorSwitcherDisplay;

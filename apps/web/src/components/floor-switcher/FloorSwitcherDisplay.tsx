import { Building, Floor } from "@cmumaps/common";

import { useState } from "react";
import { useNavigate } from "react-router";

import useBoundStore from "@/store";

import Roundel from "../shared/Roundel";
import DefaultView from "./DefaultView";

interface Props {
  building: Building;
  floor: Floor;
}

/**
 * This component allows an user to switch between floors of a building.
 * Note: handles only the display logic.
 */
const FloorSwitcherDisplay = ({ building, floor }: Props) => {
  // Library hooks
  const navigate = useNavigate();

  // Global state
  const hideSearch = useBoundStore((state) => state.hideSearch);
  const focusFloor = useBoundStore((state) => state.focusFloor);

  // Local state
  const [showFloorPicker, setShowFloorPicker] = useState<boolean>(false);

  const renderFloorPicker = () => {
    if (!floor) {
      return;
    }

    return (
      <div className="ml-2 flex items-stretch">
        {building.floors.map((floorLevel) => (
          <div
            key={floorLevel}
            className="flex items-center border-l border-gray-300"
          >
            <div
              className={
                "cursor-pointer px-4 " +
                (floorLevel === floor.level ? "font-bold" : "")
              }
              onClick={() => {
                setShowFloorPicker(false);
                focusFloor({
                  buildingCode: building.code,
                  level: floorLevel,
                });
              }}
            >
              {floorLevel}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="btn-shadow flex items-stretch justify-center rounded bg-white">
      <button
        className="cursor-pointer p-1"
        onClick={() => {
          navigate(`/${building.code}`);
          hideSearch();
        }}
      >
        <Roundel code={building.code} />
      </button>
      {showFloorPicker ? (
        renderFloorPicker()
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

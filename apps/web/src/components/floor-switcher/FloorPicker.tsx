import { Building } from "@cmumaps/common";
import { Floor } from "@cmumaps/common";

import useBoundStore from "@/store";

interface Props {
  building: Building;
  floor: Floor;
  setShowFloorPicker: (show: boolean) => void;
}

const FloorPicker = ({ building, floor, setShowFloorPicker }: Props) => {
  // Global state
  const focusFloor = useBoundStore((state) => state.focusFloor);

  if (!floor) {
    return;
  }

  return (
    <div className="flex items-stretch">
      {building.floors.map((floorLevel) => {
        const handleClick = () => {
          setShowFloorPicker(false);
          focusFloor({
            buildingCode: building.code,
            level: floorLevel,
          });
        };

        return (
          <div
            key={floorLevel}
            className="flex items-center border-l border-gray-300"
          >
            <div
              className={`cursor-pointer px-4 ${
                floorLevel === floor.level ? "font-bold" : ""
              }`}
              onClick={handleClick}
            >
              {floorLevel}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FloorPicker;

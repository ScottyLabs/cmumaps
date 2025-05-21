import { Building } from "@cmumaps/common";
import { Floor } from "@cmumaps/common";

import useBoundStore from "@/store";

interface Props {
  building: Building;
  floor: Floor;
  setShowFloorPicker: (show: boolean) => void;
}

const FloorPicker = ({ building, floor, setShowFloorPicker }: Props) => {
  const focusFloor = useBoundStore((state) => state.focusFloor);

  return building.floors.map((floorLevel) => {
    const handleClick = () => {
      setShowFloorPicker(false);
      focusFloor({
        buildingCode: building.code,
        level: floorLevel,
      });
    };

    return (
      <button
        key={floorLevel}
        className={`cursor-pointer border-l border-gray-300 px-4 ${
          floorLevel === floor.level ? "font-bold" : ""
        }`}
        onClick={handleClick}
      >
        {floorLevel}
      </button>
    );
  });
};

export default FloorPicker;

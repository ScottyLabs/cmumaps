import { Building, Floor } from "@cmumaps/common";

import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

import lockIcon from "@/assets/icons/half-lock.svg";
import DefaultViewButton from "@/components/floor-switcher/DefaultViewButton";
import useBoundStore from "@/store";

interface Props {
  building: Building;
  floor: Floor;
  setShowFloorPicker: (show: boolean) => void;
}

const DefaultView = ({ building, floor, setShowFloorPicker }: Props) => {
  // Global state
  const focusFloor = useBoundStore((state) => state.focusFloor);

  // If the building has no floors, then it is inaccessible
  if (building.floors.length === 0) {
    return (
      <div className="flex items-center">
        <p className="mr-4 ml-2">{building?.name}</p>
        <div className="flex items-center gap-1 rounded-r bg-gray-200 py-2 pr-1">
          <img alt={"Lock Icon"} src={lockIcon} />
          <p className="gray p-1 text-[#646464]">Inaccessible</p>
        </div>
      </div>
    );
  }

  const floorIndex = building.floors.indexOf(floor.level);

  const renderDownArrow = () => {
    const canGoDown = floorIndex > 0;
    const handleClick = () => {
      const floorLevel = building.floors[floorIndex - 1];
      if (floorLevel) {
        focusFloor({ buildingCode: building.code, level: floorLevel });
      }
    };

    return (
      <DefaultViewButton disabled={!canGoDown} handleClick={handleClick}>
        <IoIosArrowDown />
      </DefaultViewButton>
    );
  };

  const renderFloorLevelCell = () => {
    const renderEllipses = () => (
      <div className="flex justify-center">
        {building.floors.map((floorLevel) => (
          <div
            key={floorLevel}
            className={
              "m-[1px] h-1 w-1 rounded-full " +
              (floorLevel == floor.level ? "bg-black" : "bg-gray-400")
            }
          />
        ))}
      </div>
    );

    const disabled = building.floors.length === 1;
    const handleClick = () => {
      setShowFloorPicker(true);
    };

    return (
      <DefaultViewButton disabled={disabled} handleClick={handleClick}>
        <div>
          {building.floors[floorIndex]}
          {renderEllipses()}
        </div>
      </DefaultViewButton>
    );
  };

  const renderUpArrow = () => {
    const canGoUp = floorIndex < building.floors.length - 1;
    const handleClick = () => {
      const floorLevel = building.floors[floorIndex + 1];
      if (floorLevel) {
        focusFloor({ buildingCode: building.code, level: floorLevel });
      }
    };

    return (
      <DefaultViewButton disabled={!canGoUp} handleClick={handleClick}>
        <IoIosArrowUp />
      </DefaultViewButton>
    );
  };

  return (
    <div className="flex items-stretch">
      <p className="mx-2 flex items-center text-nowrap">{building.name}</p>
      {renderDownArrow()}
      {renderFloorLevelCell()}
      {renderUpArrow()}
    </div>
  );
};

export default DefaultView;

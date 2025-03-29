import lockIcon from "@icons/half-lock.svg";

import { useMemo, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router";

import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";
import { focusFloor } from "@/store/features/mapSlice";
import { setIsSearchOpen, selectCardCollapsed } from "@/store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import Roundel from "../shared/Roundel";

/**
 * The interface component allowing an user to see the current building
 * and switch floors.
 */
export default function FloorSwitcher() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isMobile = useIsMobile();
  const { isCardOpen } = useLocationParams();
  const { data: buildings } = useGetBuildingsQuery();
  const floor = useAppSelector((state) => state.map.focusedFloor);
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);
  const isCardCollapsed = useAppSelector(selectCardCollapsed);

  const [showFloorPicker, setShowFloorPicker] = useState<boolean>(false);

  // mobile cases when we don't want to show the floor switcher
  const showFloorSwitcherMobile = useMemo(() => {
    if (isMobile) {
      if (isCardOpen && !isCardCollapsed) {
        return false;
      }

      if (isSearchOpen) {
        return false;
      }
    }

    return true;
  }, [isCardCollapsed, isCardOpen, isMobile, isSearchOpen]);

  // only show floor switcher if there is focused floor
  if (!buildings || !floor || !showFloorSwitcherMobile) {
    return;
  }

  const building = buildings[floor.buildingCode];
  if (!building) {
    return;
  }

  const renderDefaultView = () => {
    if (building.floors.length === 0 || !floor) {
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

    const canGoDown = floorIndex > 0;
    const canGoUp = floorIndex < building.floors.length - 1;

    const buttonBaseClasses = "h-full w-full px-2 flex items-center ";

    const renderDownArrow = () => (
      <div className="border-x border-gray-300">
        <button
          title="Decrement floor"
          className={
            buttonBaseClasses + (canGoDown ? "cursor-pointer" : "text-gray-300")
          }
          disabled={!canGoDown}
          onClick={() => {
            const floorLevel = building.floors[floorIndex - 1];
            if (floorLevel) {
              const focusedFloor = {
                buildingCode: building.code,
                level: floorLevel,
              };
              dispatch(focusFloor(focusedFloor));
            }
          }}
        >
          <IoIosArrowDown />
        </button>
      </div>
    );

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
            ></div>
          ))}
        </div>
      );

      return (
        <button
          title="Select a floor"
          onClick={() => {
            setShowFloorPicker(true);
          }}
          className="cursor-pointer px-2"
          disabled={building.floors.length < 2}
        >
          <div className="text-center">{building.floors[floorIndex]}</div>
          {renderEllipses()}
        </button>
      );
    };

    const renderUpArrow = () => (
      <div className="flex items-center border-l border-gray-300">
        <button
          title="Increment floor"
          className={
            buttonBaseClasses + (canGoUp ? "cursor-pointer" : "text-gray-300")
          }
          disabled={!canGoUp}
          onClick={() => {
            const floorLevel = building.floors[floorIndex + 1];
            if (floorLevel) {
              const focusedFloor = {
                buildingCode: building.code,
                level: floorLevel,
              };
              dispatch(focusFloor(focusedFloor));
            }
          }}
        >
          <IoIosArrowUp />
        </button>
      </div>
    );

    return (
      <div className="flex items-stretch">
        <p className="mx-2 flex items-center text-nowrap">{building.name}</p>
        {renderDownArrow()}
        {renderFloorLevelCell()}
        {renderUpArrow()}
      </div>
    );
  };

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
                dispatch(
                  focusFloor({
                    buildingCode: building.code,
                    level: floorLevel,
                  }),
                );
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
          dispatch(setIsSearchOpen(false));
        }}
      >
        <Roundel code={building.code} />
      </button>
      {showFloorPicker ? renderFloorPicker() : renderDefaultView()}
    </div>
  );
}

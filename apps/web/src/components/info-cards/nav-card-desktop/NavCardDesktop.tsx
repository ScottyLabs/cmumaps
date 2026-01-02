import { useEffect, useState } from "react";
import enterIconBlack from "@/assets/icons/nav/directions-list/enter-black.svg";
import enterIconGrey from "@/assets/icons/nav/directions-list/enter-grey.svg";
import enterIconWhite from "@/assets/icons/nav/directions-list/enter-white.svg";
import exitIconBlack from "@/assets/icons/nav/directions-list/exit-black.svg";
import exitIconGrey from "@/assets/icons/nav/directions-list/exit-grey.svg";
import exitIconWhite from "@/assets/icons/nav/directions-list/exit-white.svg";
import forwardArrowIconBlack from "@/assets/icons/nav/directions-list/forward-arrow-black.svg";
import forwardArrowIconGrey from "@/assets/icons/nav/directions-list/forward-arrow-grey.svg";
import forwardArrowIconWhite from "@/assets/icons/nav/directions-list/forward-arrow-white.svg";
import leftArrowIconBlack from "@/assets/icons/nav/directions-list/left-arrow-black.svg";
import leftArrowIconGrey from "@/assets/icons/nav/directions-list/left-arrow-grey.svg";
import leftArrowIconWhite from "@/assets/icons/nav/directions-list/left-arrow-white.svg";
import rightArrowIconBlack from "@/assets/icons/nav/directions-list/right-arrow-black.svg";
import rightArrowIconGrey from "@/assets/icons/nav/directions-list/right-arrow-grey.svg";
import rightArrowIconWhite from "@/assets/icons/nav/directions-list/right-arrow-white.svg";
import cancelIcon from "@/assets/icons/nav/nav-overlay/cancel.svg";
import headerIcon from "@/assets/icons/nav/nav-overlay/header.svg";
import enterIcon from "@/assets/icons/nav/nav-overlay/header-instructions/enter.svg";
import exitIcon from "@/assets/icons/nav/nav-overlay/header-instructions/exit.svg";
import forwardArrowIcon from "@/assets/icons/nav/nav-overlay/header-instructions/forward-arrow.svg";
import leftArrowIcon from "@/assets/icons/nav/nav-overlay/header-instructions/left-arrow.svg";
import rightArrowIcon from "@/assets/icons/nav/nav-overlay/header-instructions/right-arrow.svg";
import nextInstructionIcon from "@/assets/icons/nav/nav-overlay/next-instruction.svg";
import swapIcon from "@/assets/icons/nav/nav-overlay/swap.svg";
import accessibleAvailableIcon from "@/assets/icons/nav/route-selection/accessibleAvailable.svg";
import accessibleSelectedIcon from "@/assets/icons/nav/route-selection/accessibleSelected.svg";
import accessibleUnavailableIcon from "@/assets/icons/nav/route-selection/accessibleUnavailable.svg";
import fastestAvailableIcon from "@/assets/icons/nav/route-selection/fastestAvailable.svg";
import fastestSelectedIcon from "@/assets/icons/nav/route-selection/fastestSelected.svg";
import fastestUnavailableIcon from "@/assets/icons/nav/route-selection/fastestUnavailable.svg";
import indoorAvailableIcon from "@/assets/icons/nav/route-selection/indoorAvailable.svg";
import indoorSelectedIcon from "@/assets/icons/nav/route-selection/indoorSelected.svg";
import indoorUnavailableIcon from "@/assets/icons/nav/route-selection/indoorUnavailable.svg";
import outdoorAvailableIcon from "@/assets/icons/nav/route-selection/outdoorAvailable.svg";
import outdoorSelectedIcon from "@/assets/icons/nav/route-selection/outdoorSelected.svg";
import outdoorUnavailableIcon from "@/assets/icons/nav/route-selection/outdoorUnavailable.svg";
import useNavigationParams from "@/hooks/useNavigationParams";
import useBoundStore from "@/store";

const WALKING_SPEED = 100;

interface DirectionIconSet {
  Black: string;
  White: string;
  Grey: string;
}

const DirectionIcons: Record<string, DirectionIconSet> = {
  Forward: {
    Black: forwardArrowIconBlack,
    White: forwardArrowIconWhite,
    Grey: forwardArrowIconGrey,
  },
  Left: {
    Black: leftArrowIconBlack,
    White: leftArrowIconWhite,
    Grey: leftArrowIconGrey,
  },
  Right: {
    Black: rightArrowIconBlack,
    White: rightArrowIconWhite,
    Grey: rightArrowIconGrey,
  },
  Enter: {
    Black: enterIconBlack,
    White: enterIconWhite,
    Grey: enterIconGrey,
  },
  Exit: {
    Black: exitIconBlack,
    White: exitIconWhite,
    Grey: exitIconGrey,
  },
};

interface DirectionProps {
  distance: number;
  action: string;
  id: string;
}

const NavCardDesktop = () => {
  const setSearchTarget = useBoundStore((state) => state.setSearchTarget);
  const searchTarget = useBoundStore((state) => state.searchTarget);
  const startNav = useBoundStore((state) => state.startNav);
  const isNavigating = useBoundStore((state) => state.isNavigating);

  const navigationOptions: {
    id: "Fastest" | "Accessible" | "Inside" | "Outside";
    selectedIcon: string;
    availableIcon: string;
    unavailableIcon: string;
  }[] = [
    {
      id: "Fastest",
      selectedIcon: fastestSelectedIcon,
      availableIcon: fastestAvailableIcon,
      unavailableIcon: fastestUnavailableIcon,
    },
    {
      id: "Accessible",
      selectedIcon: accessibleSelectedIcon,
      availableIcon: accessibleAvailableIcon,
      unavailableIcon: accessibleUnavailableIcon,
    },
    {
      id: "Inside",
      selectedIcon: indoorSelectedIcon,
      availableIcon: indoorAvailableIcon,
      unavailableIcon: indoorUnavailableIcon,
    },
    {
      id: "Outside",
      selectedIcon: outdoorSelectedIcon,
      availableIcon: outdoorAvailableIcon,
      unavailableIcon: outdoorUnavailableIcon,
    },
  ];

  const selectedPath = useBoundStore((state) => state.selectedPath);
  const setSelectedPath = useBoundStore((state) => state.setSelectedPath);

  const {
    navPaths,
    srcName,
    dstName,
    srcType,
    setDst,
    setSrc,
    swap,
    dstShortName,
  } = useNavigationParams();

  const distance = Math.round(navPaths?.[selectedPath]?.path.distance ?? 0);
  const time = Math.round((navPaths?.[selectedPath]?.path.distance ?? 0) / 100);
  const endTime = new Date(Date.now() + time * 60 * 1000).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  );

  const instructionIcons: Record<string, string> = {
    Left: leftArrowIcon,
    Right: rightArrowIcon,
    Forward: forwardArrowIcon,
    Enter: enterIcon,
    Exit: exitIcon,
  };

  const instructionTitles: Record<string, string> = {
    Left: "Turn Left",
    Right: "Turn Right",
    Forward: "Stay Straight",
    Arrive: "Arrived",
    Enter: "Enter",
    Exit: "Exit",
  };

  const instructions = useBoundStore((state) => state.navInstructions) ?? [];
  const instructionIndex = useBoundStore((state) => state.navInstructionIndex);

  const setInstructionIndex = useBoundStore(
    (state) => state.setNavInstructionIndex,
  );

  const action = instructions[instructionIndex]?.action;

  const [pastDirections, setPastDirections] = useState<
    Record<number, DirectionProps[]>
  >([]);
  const [futureDirections, setFutureDirections] = useState<
    Record<number, DirectionProps[]>
  >([]);

  useEffect(() => {
    console.log("rendering directions list");
  }, []);

  useEffect(() => {
    const past: Record<number, DirectionProps[]> = [];
    const future: Record<number, DirectionProps[]> = [];

    let currentDistance = 0;
    for (let i = 0; i < instructionIndex; i++) {
      currentDistance += instructions[i]?.distance ?? 0;
    }

    let distanceAcc = 0;
    instructions.forEach((instruction, index) => {
      if (index === instructions.length - 1) return;
      const time = Math.floor(
        Math.abs(distanceAcc - currentDistance) / WALKING_SPEED,
      );
      const entry = {
        distance: instruction.distance,
        action: instruction.action,
        id: instruction.node_id,
      };
      if (index < instructionIndex) {
        past[time] = past[time] ? [...past[time], entry] : [entry];
      } else if (index > instructionIndex) {
        future[time] = future[time] ? [...future[time], entry] : [entry];
      }
      distanceAcc += instruction.distance;
    });

    setPastDirections(past);
    setFutureDirections(future);
  }, [instructions, instructionIndex]);

  const renderChooseHeader = () => {
    return (
      <div className="btn-shadow overflow-auto bg-white">
        <div className="flex">
          <img
            alt="navigation header"
            src={headerIcon}
            className="mt-[14px] mr-[10px] mb-[9px] ml-[13px] h-[84px] w-[33px]"
            width={33}
            height={84}
          />
          <div className="btn-shadow absolute top-[70.22px] left-[18.22px] h-[22.56px] w-[22.56px] rounded-full" />

          <div className="w-full">
            <div className="flex flex-col items-start gap-3 pt-[23.5px]">
              <div className="relative flex h-[19px] w-full self-stretch">
                <button
                  type="button"
                  onClick={() => {
                    if (searchTarget !== "nav-src") {
                      setSearchTarget("nav-src");
                    } else {
                      setSearchTarget(undefined);
                    }
                  }}
                  className="relative my-[-8px] w-full whitespace-nowrap text-start text-[#1e86ff] text-[min(1rem,4vw)]"
                >
                  {srcName}
                </button>
              </div>

              <hr className="w-full border-gray-300" />

              <div className="relative flex h-[19px] w-full self-stretch">
                <button
                  onClick={() => {
                    if (searchTarget !== "nav-dst") {
                      setSearchTarget("nav-dst");
                    } else {
                      setSearchTarget(undefined);
                    }
                  }}
                  type="button"
                  className="relative my-[-8px] w-full whitespace-nowrap text-start text-[min(1rem,4vw)] text-black"
                >
                  {dstName}
                </button>
              </div>
            </div>
            <button
              type="button"
              className="absolute top-0 right-[13px]"
              onClick={() => {
                if (srcType === "User") {
                  setSrc(null);
                } else {
                  setSrc("user");
                }
              }}
            >
              <img src={cancelIcon} alt="cancel" />
            </button>
            <button
              type="button"
              className="absolute right-[13px] bottom-[17px]"
              onClick={swap}
            >
              <img src={swapIcon} alt="swap" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPathInfo = () => {
    return (
      <div className="h-9">
        <div className="flex">
          <div className="flex-col pr-4">
            <div className="w-full font-bold text-[min(1.25rem,5vw)] text-black">
              {endTime}
            </div>
            <div className="w-full -translate-y-2 text-center">arrival</div>
          </div>
          <div className="flex-col pr-4">
            <div className="w-full text-center font-bold text-[min(1.25rem,5vw)] text-black">
              {time}
            </div>
            <div className="w-full -translate-y-2 text-center">min</div>
          </div>
          <div className="flex-col">
            <div className="w-full text-center font-bold text-[min(1.25rem,5vw)] text-black">
              {distance}
            </div>
            <div className="w-full -translate-y-2 text-center">ft</div>
          </div>
        </div>
      </div>
    );
  };

  const renderChooseCard = () => {
    return (
      <div className="relative flex w-full flex-col items-start self-stretch bg-white">
        <div className="flex w-full items-center justify-center self-stretch pt-4">
          {navigationOptions.map((option) => {
            const isAvailable = !!navPaths?.[option.id];
            const isSelected = option.id === selectedPath;
            return (
              <button
                type="button"
                onClick={
                  isAvailable && !isSelected
                    ? () => setSelectedPath(option.id)
                    : () => {}
                }
                key={option.id}
                className={`relative flex flex-1 grow flex-col items-center gap-0.5 pt-2 pb-1 ${isSelected ? "bg-white" : ""}`}
              >
                <img
                  className="relative h-6 w-6"
                  alt={option.id}
                  src={
                    isSelected
                      ? option.selectedIcon
                      : isAvailable
                        ? option.availableIcon
                        : option.unavailableIcon
                  }
                />

                <div
                  className={`relative self-stretch pb-px text-center ${
                    isSelected
                      ? "text-primary-blue underline"
                      : isAvailable
                        ? "text-black"
                        : "text-primary-grey"
                  }`}
                >
                  {option.id}
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative flex h-26 w-full justify-between self-stretch bg-light-blue pt-5 pr-5 pb-11 pl-5">
          {navPaths?.[selectedPath] ? (
            renderPathInfo()
          ) : (
            <div className="h-9 text-black text-xl">Path unavailable...</div>
          )}

          <button
            type="button"
            className={`${!navPaths ? "bg-primary-grey" : "bg-[#31b777]"} btn-shadow inline-flex h-10 w-[min(25vw,6.5rem)] items-center justify-center rounded-full font-medium text-sm`}
            disabled={!navPaths?.[selectedPath]}
            onClick={() => {
              startNav();
            }}
          >
            <span className="text-center text-white">GO</span>
          </button>
        </div>
      </div>
    );
  };

  const renderDirectionsList = () => {
    const renderDirection = (
      directions: DirectionProps[],
      time: number,
      isPast: boolean,
      i: number,
    ) => {
      const timeLabel = time > 0 ? time : "<1";

      return (
        <div className="px-12 py-6" key={i}>
          <div className={`pb-3 ${isPast ? "text-light-grey" : "text-black"}`}>
            {isPast ? `${timeLabel} MIN AGO` : `IN ${timeLabel} MIN`}
          </div>
          <hr className={isPast ? "border-light-grey" : "border-black"} />
          {directions.map((dir, j) =>
            renderDirectionEntry(dir, isPast ? "Grey" : "Black", j),
          )}
        </div>
      );
    };

    const renderDirectionEntry = (
      { distance, action, id }: DirectionProps,
      color: "Black" | "White" | "Grey",
      i?: number,
    ) => {
      const textColors = {
        Black: "text-black",
        White: "text-white",
        Grey: "text-light-grey",
      };
      const buildingCode = navPaths?.[selectedPath]?.path.path.find(
        (n) => n.id === id,
      )?.floor.buildingCode;

      const buildingName =
        buildingCode === "outside" ? "Outside" : buildingCode;
      return (
        <div className="flex pt-2" key={i}>
          <div
            className={`mr-5 font-bold font-lato text-[2rem] ${textColors[color]}`}
          >
            {distance} ft
          </div>

          <img
            src={DirectionIcons[action]?.[color]}
            alt="forward"
            width={26}
            height={26}
            className="mr-5"
          />
          <div
            className={`ml-auto pt-3 font-bold font-lato text-[1rem] ${textColors[color]}`}
          >
            {buildingName}
          </div>
        </div>
      );
    };

    return (
      <div className="overflow-y-scroll bg-white">
        {Object.entries(pastDirections)
          .reverse()
          .map(([k, v], i) =>
            renderDirection(v, Number.parseInt(k, 10), true, i),
          )}
        {instructionIndex < instructions.length - 1 && (
          <hr className="mx-4 rounded-full border-2 border-primary-green" />
        )}
        {Object.entries(futureDirections).map(([k, v], i) =>
          renderDirection(v, Number.parseInt(k, 10), false, i),
        )}
      </div>
    );
  };

  const renderNavigateHeader = () => {
    return action === "Arrive"
      ? renderArrivedHeader()
      : renderInstructionHeader();
  };

  const renderInstructionHeader = () => {
    return (
      <div className="btn-shadow bg-primary-green">
        <div className="flex justify-between">
          <img
            src={instructionIcons[action || "Forward"]}
            alt="forward"
            className="mt-[22px] ml-[30px]"
          />
          <div className="mt-4 flex-col">
            <div className="font-lato font-semibold text-[min(2rem,7.5vw)] text-white">
              {instructionTitles[action || "Forward"]}
            </div>
            <div className="-translate-y-2 pl-[2px] font-lato font-semibold text-[15px] text-white">
              {distance === 0
                ? "Directly ahead"
                : `${action === "Forward" ? "for" : "in"} ${distance} ft`}
            </div>
          </div>
          <div className="mx-4 self-center font-lato font-semibold text-[17px] text-white">
            {dstShortName}
          </div>
        </div>
        <div className="mx-5 my-4 flex justify-between px-px pb-0.5">
          <button
            className={`flex ${instructionIndex > 0 ? "" : "disabled opacity-0"}`}
            type="button"
            onClick={() => {
              setInstructionIndex(Math.max(0, instructionIndex - 1));
            }}
          >
            <img
              className="w-6 rotate-180"
              src={nextInstructionIcon}
              alt="next instruction"
            />
            <div className="px-2 font-bold font-lato text-[1rem] text-white">
              Prev
            </div>
          </button>
          <div className="px-2 font-bold font-lato text-[1rem] text-white">
            {instructionIndex + 1}/{instructions.length}
          </div>
          <button
            className={`flex ${instructionIndex < instructions.length - 1 ? "" : "disabled opacity-0"}`}
            type="button"
            onClick={() => {
              setInstructionIndex(
                Math.min(instructions.length - 1, instructionIndex + 1),
              );
            }}
          >
            <div className="px-2 font-bold font-lato text-[1rem] text-white">
              Next
            </div>
            <img
              src={nextInstructionIcon}
              className="w-6"
              alt="next instruction"
            />
          </button>
        </div>
      </div>
    );
  };

  const renderArrivedHeader = () => {
    return (
      <div className="btn-shadow top-10 bg-primary-blue">
        <div className="flex justify-center">
          <div className="mt-4 flex-col">
            <div className="flex justify-center font-lato font-semibold text-[2rem] text-white">
              You Have Arrived
            </div>
            <div className="flex justify-center font-lato font-semibold text-[1rem] text-white">
              Near {dstName}
            </div>
          </div>
        </div>
        <div className="mx-5 my-4 flex justify-between px-px pb-0.5">
          <button
            className={`flex ${instructionIndex > 0 ? "" : "disabled opacity-0"}`}
            type="button"
            onClick={() => {
              setInstructionIndex(Math.max(0, instructionIndex - 1));
            }}
          >
            <img
              className="rotate-180"
              src={nextInstructionIcon}
              alt="next instruction"
            />
            <div className="px-2 font-bold font-lato text-[1rem] text-white">
              Prev
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderNavCard = () => {
    return (
      <div className="my-8 ml-9 flex justify-between">
        {renderPathInfo()}
        <button
          type="button"
          className="btn-shadow mr-5 inline-flex h-10 w-[min(25vw,6.5rem)] items-center justify-center rounded-full bg-primary-red font-medium"
          onClick={() => {
            setDst(null);
            setSrc(null);
          }}
        >
          <span className="text-center text-white">End</span>
        </button>
      </div>
    );
  };

  return (
    <>
      {!isNavigating ? (
        <>
          {renderChooseHeader()}
          <hr className="w-full border-gray-300" />
          {renderChooseCard()}
        </>
      ) : (
        <>
          {renderNavigateHeader()}
          {renderNavCard()}
          <hr />
          {renderDirectionsList()}
        </>
      )}
    </>
  );
};

export default NavCardDesktop;

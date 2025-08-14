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

const NavDirectionsList = ({ show }: { show: boolean }) => {
  interface DirectionProps {
    distance: number;
    action: string;
    id: string;
  }

  const instructions = useBoundStore((state) => state.navInstructions) ?? [];
  const instructionIndex = useBoundStore((state) => state.navInstructionIndex);
  const selectedPath = useBoundStore((state) => state.selectedPath);

  const [pastDirections, setPastDirections] = useState<
    Record<number, DirectionProps[]>
  >([]);
  const [futureDirections, setFutureDirections] = useState<
    Record<number, DirectionProps[]>
  >([]);

  const { navPaths } = useNavigationParams();

  // const { data: buildings } = $api.useQuery("get", "/buildings");

  //Compute past and future directions based on current instruction index
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

    const buildingName = buildingCode === "outside" ? "Outside" : buildingCode;
    // : buildings && buildingCode
    //   ? buildings[buildingCode]?.name || "Invalid Building"
    //   : "";
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

  const [yControl, setYControl] = useState(-100);

  useEffect(() => {
    setYControl(show ? 0 : -100);
  }, [show]);

  return (
    <div
      className={`${show && "btn-shadow"} fixed inset-x-0 top-0 bottom-30 z-40 flex-col overflow-y-scroll bg-white transition duration-300 ease-in-out`}
      style={{ transform: `translateY(${yControl}%)` }}
    >
      {Object.entries(pastDirections)
        .reverse()
        .map(([k, v], i) => renderDirection(v, Number.parseInt(k), true, i))}
      {instructionIndex < instructions.length - 1 && (
        <div className="sticky top-0 bottom-0 mx-3 mt-3 bg-white py-3">
          <div className="btn-shadow rounded-xl bg-primary-green px-9 pb-3">
            {renderDirectionEntry(
              {
                distance: instructions[instructionIndex]?.distance ?? 0,
                action: instructions[instructionIndex]?.action ?? "",
                id: instructions[instructionIndex]?.node_id ?? "",
              },
              "White",
            )}
          </div>
        </div>
      )}
      {Object.entries(futureDirections).map(([k, v], i) =>
        renderDirection(v, Number.parseInt(k), false, i),
      )}
    </div>
  );
};

export default NavDirectionsList;

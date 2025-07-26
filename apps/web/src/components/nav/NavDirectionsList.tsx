import { useEffect, useState } from "react";
import forwardArrowIconBlack from "@/assets/icons/nav/directions-list/forward-arrow-black.svg";
import forwardArrowIconGrey from "@/assets/icons/nav/directions-list/forward-arrow-grey.svg";
import forwardArrowIconWhite from "@/assets/icons/nav/directions-list/forward-arrow-white.svg";
import leftArrowIconBlack from "@/assets/icons/nav/directions-list/left-arrow-black.svg";
import leftArrowIconGrey from "@/assets/icons/nav/directions-list/left-arrow-grey.svg";
import leftArrowIconWhite from "@/assets/icons/nav/directions-list/left-arrow-white.svg";
import rightArrowIconBlack from "@/assets/icons/nav/directions-list/right-arrow-black.svg";
import rightArrowIconGrey from "@/assets/icons/nav/directions-list/right-arrow-grey.svg";
import rightArrowIconWhite from "@/assets/icons/nav/directions-list/right-arrow-white.svg";
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
};

const NavDirectionsList = ({ show }: { show: boolean }) => {
  interface DirectionProps {
    distance: number;
    action: string;
  }

  const instructions = useBoundStore((state) => state.navInstructions) ?? [];
  const instructionIndex = useBoundStore((state) => state.navInstructionIndex);

  const [pastDirections, setPastDirections] = useState<
    Record<number, DirectionProps[]>
  >([]);
  const [futureDirections, setFutureDirections] = useState<
    Record<number, DirectionProps[]>
  >([]);

  //Compute past and future directions based on current instruction index
  useEffect(() => {
    const past: Record<number, DirectionProps[]> = [];
    const future: Record<number, DirectionProps[]> = [];

    let currentDistance = 0;
    for (let i = 0; i < instructionIndex; i++) {
      currentDistance += instructions[i]?.distance ?? 0;
    }

    console.log(`Current Distance: ${currentDistance}`);

    let distanceAcc = 0;
    instructions.forEach((instruction, index) => {
      if (index === instructions.length - 1) return;
      const time = Math.floor(
        Math.abs(distanceAcc - currentDistance) / WALKING_SPEED,
      );
      const entry = {
        time,
        distance: instruction.distance,
        action: instruction.action,
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
    return (
      <div className="px-12 py-6" key={i}>
        <div className={`pb-3 ${isPast ? "text-light-grey" : "text-black"}`}>
          {isPast ? `${time} MIN AGO` : `IN ${time} MIN`}
        </div>
        <hr className={isPast ? "border-light-grey" : "border-black"} />
        {directions.map((dir, j) =>
          renderDirectionEntry(dir, isPast ? "Grey" : "Black", j),
        )}
      </div>
    );
  };

  const renderDirectionEntry = (
    { distance, action }: DirectionProps,
    color: "Black" | "White" | "Grey",
    i?: number,
  ) => {
    const textColors = {
      Black: "text-black",
      White: "text-white",
      Grey: "text-light-grey",
    };
    return (
      <div className="flex pt-2" key={i}>
        <img
          src={DirectionIcons[action]?.[color]}
          alt="forward"
          width={26}
          height={26}
          className="mr-5"
        />
        <div
          className={`mr-5 font-bold font-lato text-[2rem] ${textColors[color]}`}
        >
          {distance} ft
        </div>

        <div
          className={`ml-auto pt-3 font-bold font-lato text-[1rem] ${textColors[color]}`}
        >
          Wean Hall
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
      className="btn-shadow fixed inset-x-0 top-0 bottom-30 z-40 flex-col overflow-y-scroll bg-white transition duration-300 ease-in-out"
      style={{ transform: `translateY(${yControl}%)` }}
    >
      {Object.entries(pastDirections)
        .reverse()
        .map(([k, v], i) => renderDirection(v, Number.parseInt(k), true, i))}
      {instructionIndex < instructions.length - 1 && (
        <div className="btn-shadow sticky top-0 bottom-0 z-10 mx-3 mt-6 mb-3 rounded-xl bg-primary-green px-9 pb-3">
          {renderDirectionEntry(
            {
              distance: instructions[instructionIndex]?.distance ?? 0,
              action: instructions[instructionIndex]?.action ?? "",
            },
            "White",
          )}
        </div>
      )}
      {Object.entries(futureDirections).map(([k, v], i) =>
        renderDirection(v, Number.parseInt(k), false, i),
      )}
    </div>
  );
};

export default NavDirectionsList;

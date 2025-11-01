import cancelIcon from "@/assets/icons/nav/nav-overlay/cancel.svg";
import headerIcon from "@/assets/icons/nav/nav-overlay/header.svg";
import enterIcon from "@/assets/icons/nav/nav-overlay/header-instructions/enter.svg";
import exitIcon from "@/assets/icons/nav/nav-overlay/header-instructions/exit.svg";
import forwardArrowIcon from "@/assets/icons/nav/nav-overlay/header-instructions/forward-arrow.svg";
import leftArrowIcon from "@/assets/icons/nav/nav-overlay/header-instructions/left-arrow.svg";
import rightArrowIcon from "@/assets/icons/nav/nav-overlay/header-instructions/right-arrow.svg";
import nextInstructionIcon from "@/assets/icons/nav/nav-overlay/next-instruction.svg";
import swapIcon from "@/assets/icons/nav/nav-overlay/swap.svg";
import useNavigationParams from "@/hooks/useNavigationParams";
import useBoundStore from "@/store";

interface NavHeaderProps {
  isNavigating: boolean;
  startNav: () => void;
  listShown: boolean;
}

const NavHeader = ({
  isNavigating,
  // listShown,
}: NavHeaderProps) => {
  const setSearchTarget = useBoundStore((state) => state.setSearchTarget);
  const searchTarget = useBoundStore((state) => state.searchTarget);

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

  const { srcName, dstName, dstShortName, srcType, setSrc, swap } =
    useNavigationParams();

  const instructions = useBoundStore((state) => state.navInstructions) ?? [];
  const instructionIndex = useBoundStore((state) => state.navInstructionIndex);

  const setInstructionIndex = useBoundStore(
    (state) => state.setNavInstructionIndex,
  );

  const distance = instructions[instructionIndex]?.distance;
  const action = instructions[instructionIndex]?.action;

  const renderChooseHeader = () => {
    return (
      <div className="btn-shadow fixed inset-x-[19px] top-15 overflow-auto rounded-lg bg-white">
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

  const renderNavigateHeader = () => {
    return action === "Arrive"
      ? renderArrivedHeader()
      : renderInstructionHeader();
  };

  const renderInstructionHeader = () => {
    return (
      <div className="btn-shadow fixed inset-x-5 top-10 overflow-auto rounded-lg bg-primary-green">
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
      <div className="btn-shadow fixed inset-x-5 top-10 overflow-auto rounded-lg bg-primary-blue">
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

  return isNavigating ? renderNavigateHeader() : renderChooseHeader();
};

export default NavHeader;

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

  // if (listShown) {
  //   return;
  // }

  const { srcName, dstName, dstShortName, setSrc, swap } =
    useNavigationParams();

  const instructions = useBoundStore((state) => state.navInstructions) ?? [];
  const instructionIndex = useBoundStore((state) => state.navInstructionIndex);

  const setInstructionIndex = useBoundStore(
    (state) => state.setNavInstructionIndex,
  );

  // const distance = useMemo(() => instructions[instructionIndex]?.distance, [instructions, instructionIndex]);
  // const action = useMemo(() => instructions[instructionIndex]?.action, [instructions, instructionIndex]);
  const distance = instructions[instructionIndex]?.distance;
  const action = instructions[instructionIndex]?.action;

  const renderChooseHeader = () => {
    return (
      <div className="btn-shadow fixed inset-x-[19px] top-10 overflow-auto rounded-lg bg-white">
        <div className="flex">
          <img
            alt="navigation header"
            src={headerIcon}
            className="mt-[14px] mr-[10px] mb-[9px] ml-[13px] h-[84px] w-[33px]"
            width={33}
            height={84}
          />
          <div className="btn-shadow absolute top-[70.22px] left-[18.22px] h-[22.56px] w-[22.56px] rounded-full" />

          {/* <div className="w-full">
					<div className="relative pb-[11.5px] pt-[23.5px] w-fit font-body-1 font-[number:var(--body-1-font-weight)] text-[#1e86ff] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] whitespace-nowrap [font-style:var(--body-1-font-style)]">
						Your Location
					</div>
					<hr className="border-gray-200" />
					<div className="relative pt-[11.5px] pb-[20px] w-fit font-body-1 font-[number:var(--body-1-font-weight)] text-black text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)] whitespace-nowrap [font-style:var(--body-1-font-style)]">
						Gates & Hillman Centers
					</div>
				</div> */}
          <div className="w-full">
            <div className="flex flex-col items-start gap-3 pt-[23.5px]">
              <div className="relative flex h-[19px] w-full items-center gap-2.5 self-stretch">
                <button
                  type="button"
                  onClick={() => {
                    if (searchTarget !== "nav-src") {
                      setSearchTarget("nav-src");
                    } else {
                      setSearchTarget(undefined);
                    }
                  }}
                  className="relative mt-[-1.50px] w-fit whitespace-nowrap font-[number:var(--body-1-font-weight)] font-body-1 text-[#1e86ff] text-[length:var(--body-1-font-size)] leading-[var(--body-1-line-height)] tracking-[var(--body-1-letter-spacing)] [font-style:var(--body-1-font-style)]"
                >
                  {srcName}
                </button>
              </div>

              <hr className="w-full border-gray-300" />

              <button
                onClick={() => {
                  if (searchTarget !== "nav-dst") {
                    setSearchTarget("nav-dst");
                  } else {
                    setSearchTarget(undefined);
                  }
                }}
                type="button"
                className="relative font-body-1 text-black"
              >
                {dstName}
              </button>
            </div>
            <button
              type="button"
              className="absolute top-[0px] right-[13.63px]"
              onClick={() => {
                setSrc("user");
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
        <div className="flex">
          <img
            src={instructionIcons[action || "Forward"]}
            alt="forward"
            className="mt-[22px] mr-[19px] ml-[30px]"
          />
          <div className="mt-[16px] flex-col">
            <div className="font-lato font-semibold text-[2rem] text-white">
              {instructionTitles[action || "Forward"]}
            </div>
            <div className="-translate-y-2 pl-[2px] font-lato font-semibold text-[15px] text-white">
              {action === "Forward" ? "for" : "in"} {distance} ft
            </div>
          </div>
          <div className="-translate-y-2 absolute top-10 right-5 font-lato font-semibold text-[17px] text-white">
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
              className="rotate-180"
              src={nextInstructionIcon}
              alt="next instruction"
            />
            <div className="px-2 font-bold font-lato text-[1rem] text-white">
              Prev
            </div>
          </button>
          <div className="px-2 font-bold font-lato text-[1rem] text-white">
            {instructionIndex + 1}/{instructions.length} (Debug)
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
            <img src={nextInstructionIcon} alt="next instruction" />
          </button>
        </div>
      </div>
    );
  };

  const renderArrivedHeader = () => {
    return (
      <div className="btn-shadow fixed inset-x-5 top-10 overflow-auto rounded-lg bg-primary-blue">
        <div className="flex justify-center">
          <div className="mt-[16px] flex-col">
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

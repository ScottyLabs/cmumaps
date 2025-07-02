import { useEffect, useState } from "react";
import navStackIcon from "@/assets/icons/nav/nav-stack.svg";

interface NavHeaderProps {
  src: string;
  dst: string;
  isNavigating: boolean;
  setSrc: (_: string | null) => void;
  setDst: (_: string | null) => void;
  startNav: () => void;
  pathDist: number;
  toggleListShown: () => void;
  listShown: boolean;
}

// Frame component
const NavCard = ({
  setSrc,
  setDst,
  isNavigating,
  startNav,
  toggleListShown,
  listShown,
}: NavHeaderProps) => {
  // Navigation options data
  const navigationOptions = [
    {
      id: "fastest",
      icon: "https://c.animaapp.com/mc2d479d5LjgzY/img/fastest.svg",
      label: "Fastest",
      isSelected: false,
    },
    {
      id: "accessible",
      label: "Accessible",
      isSelected: true,
    },
    {
      id: "inside",
      icon: "https://c.animaapp.com/mc2d479d5LjgzY/img/indoor.svg",
      label: "Inside",
      isSelected: false,
    },
    {
      id: "outside",
      icon: "https://c.animaapp.com/mc2d479d5LjgzY/img/outside.svg",
      label: "Outside",
      isSelected: false,
    },
  ];

  // Trip information
  const tripInfo = {
    arrivalTime: "9:56",
    duration: "10",
    distance: "3.7",
  };

  const [yControl, setYControl] = useState(300);

  useEffect(() => {
    setYControl(isNavigating ? 64 : 0);
  }, [isNavigating]);

  const renderChooseCard = () => {
    return (
      <div
        className="relative flex flex-col items-center bg-white px-0 pt-4 pb-0"
        data-model-id="47:143"
      >
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
          {/* Navigation options */}
          <div className="relative flex w-full flex-[0_0_auto] items-center justify-center self-stretch px-0 pt-2 pb-[5px]">
            {navigationOptions.map((option) => (
              <div
                key={option.id}
                className={`relative flex flex-1 grow flex-col items-center gap-0.5 ${option.isSelected ? "bg-white" : ""}`}
              >
                {option.id === "accessible" ? (
                  <div className="relative h-6 w-6 rounded bg-[#1e86ff]">
                    <div className="relative top-0.5 left-0.5 h-5 w-5">
                      <div className="relative top-1 left-1 h-[13px] w-[13px] bg-[100%_100%] bg-[url(https://c.animaapp.com/mc2d479d5LjgzY/img/union.svg)]" />
                    </div>
                  </div>
                ) : (
                  <img
                    className="relative h-6 w-6"
                    alt={option.label}
                    src={option.icon}
                  />
                )}

                <div
                  className={`relative self-stretch text-center font-[number:var(--body-2-font-weight)] font-body-2 text-[length:var(--body-2-font-size)] leading-[var(--body-2-line-height)] tracking-[var(--body-2-letter-spacing)] [font-style:var(--body-2-font-style)] ${
                    option.id === "accessible"
                      ? "text-[#1e86ff] underline"
                      : option.id === "fastest"
                        ? "text-[#bec1c6]"
                        : "text-lightcolorbaseprimarydark"
                  }`}
                >
                  {option.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trip information panel */}
          <div className="w-full border border-none bg-card text-card-foreground shadow">
            <div className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch bg-[#f1f4fd] p-0 px-[21px] pt-[19px] pb-[11px]">
              <div className="h-9 w-36">
                <div className="flex">
                  <div className="w-full text-center font-bold text-[19px] text-black">
                    {tripInfo.arrivalTime}
                  </div>
                  <div className="w-full text-center font-bold text-[19px] text-black">
                    {tripInfo.duration}
                  </div>
                  <div className="w-full text-center font-bold text-[19px] text-black">
                    {tripInfo.distance}
                  </div>
                </div>
                <div className="-translate-y-2 flex">
                  <div className="w-full text-center">arrival</div>
                  <div className="w-full text-center">min</div>
                  <div className="w-full text-center">mi</div>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex h-[39px] w-[104px] items-center justify-center rounded-full bg-[#31b777] font-medium text-sm shadow-[0px_4px_4px_#00000040] transition-colors hover:bg-[#2aa56a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                onClick={() => {
                  startNav();
                }}
              >
                <span className="text-center font-[number:var(--body-2-font-weight)] font-body-2 text-[length:var(--body-2-font-size)] text-white leading-[var(--body-2-line-height)] tracking-[var(--body-2-letter-spacing)] [font-style:var(--body-2-font-style)]">
                  GO
                </span>
              </button>
            </div>
          </div>

          {/* Bottom indicator */}
          <div className="relative flex h-[34px] w-full items-end justify-center self-stretch bg-[#f1f4fd] pb-2">
            <div className="relative h-[5px] w-[134px] rounded-[100px] bg-transparent" />
          </div>
        </div>
      </div>
    );
  };

  const renderNavCard = () => {
    return (
      <div className="mt-[31px] ml-[35.74px] flex h-9">
        <div className="w-39">
          <div className="flex">
            <div className="w-full text-center font-bold text-[19px] text-black">
              {tripInfo.arrivalTime}
            </div>
            <div className="w-full text-center font-bold text-[19px] text-black">
              {tripInfo.duration}
            </div>
            <div className="w-full text-center font-bold text-[19px] text-black">
              {tripInfo.distance}
            </div>
          </div>
          <div className="-translate-y-2 flex">
            <div className="w-full text-center">arrival</div>
            <div className="w-full text-center">min</div>
            <div className="w-full text-center">mi</div>
          </div>
        </div>
        <button
          type="button"
          className="absolute right-5 inline-flex h-[39px] w-[104px] items-center justify-center rounded-full bg-[#C41230] font-medium text-sm shadow-[0px_4px_4px_#00000040] transition-colors hover:bg-[#2aa56a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          onClick={() => {
            setDst(null);
            setSrc(null);
          }}
        >
          <span className="text-center font-[number:var(--body-2-font-weight)] font-body-2 text-[length:var(--body-2-font-size)] text-white leading-[var(--body-2-line-height)] tracking-[var(--body-2-letter-spacing)] [font-style:var(--body-2-font-style)]">
            End
          </span>
        </button>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 transition duration-300 ease-in-out"
      style={{ transform: `translateY(${yControl}px)` }}
    >
      {isNavigating && (
        <div className="flex justify-end p-4">
          <button
            type="button"
            className="btn-shadow rounded-full"
            onClick={toggleListShown}
          >
            <img src={navStackIcon} alt="directions list" />
          </button>
        </div>
      )}
      <div
        className={`${listShown ? "shadow-2xl shadow-black" : "btn-shadow rounded-t-3xl"} z-50 h-46 overflow-auto bg-white shadow-lg`}
      >
        {isNavigating ? renderNavCard() : renderChooseCard()}
      </div>
    </div>
  );
};

export default NavCard;

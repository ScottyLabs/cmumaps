import { useEffect, useState } from "react";
import navStackIcon from "@/assets/icons/nav/nav-stack.svg";
import accessibleUnavailableIcon from "@/assets/icons/nav/route-selection/accessibleUnavailable.svg";
import fastestSelectedIcon from "@/assets/icons/nav/route-selection/fastestSelected.svg";
import indoorUnavailableIcon from "@/assets/icons/nav/route-selection/indoorUnavailable.svg";
import outdoorUnavailableIcon from "@/assets/icons/nav/route-selection/outdoorUnavailable.svg";
import useNavigationParams from "@/hooks/useNavigationParams";

interface NavHeaderProps {
  isNavigating: boolean;
  startNav: () => void;
  toggleListShown: () => void;
  listShown: boolean;
}

// Frame component
const NavCard = ({
  isNavigating,
  startNav,
  toggleListShown,
  listShown,
}: NavHeaderProps) => {
  // Navigation options data
  const navigationOptions = [
    {
      id: "fastest",
      icon: fastestSelectedIcon,
      label: "Fastest",
      isSelected: true,
      //Change to enum
      isAvailable: true,
    },
    {
      id: "accessible",
      label: "Accessible",
      icon: accessibleUnavailableIcon,
      isSelected: false,
      isAvailable: false,
    },
    {
      id: "inside",
      icon: indoorUnavailableIcon,
      label: "Inside",
      isSelected: false,
      isAvailable: false,
    },
    {
      id: "outside",
      icon: outdoorUnavailableIcon,
      label: "Outside",
      isSelected: false,
      isAvailable: false,
    },
  ];

  const { navPaths, setSrc, setDst } = useNavigationParams();

  const distance = Math.round(navPaths?.Fastest?.path.distance ?? 0);
  const time = Math.round((navPaths?.Fastest?.path.distance ?? 0) / 100);
  // const now = new Date();
  const endTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const [yControl, setYControl] = useState(300);

  useEffect(() => {
    setYControl(isNavigating ? 64 : 0);
  }, [isNavigating]);

  const renderChooseCard = () => {
    return (
      // <div className="relative flex flex-col items-center bg-white">
      <div className="relative flex w-full flex-col items-start self-stretch bg-white">
        <div className="flex w-full items-center justify-center self-stretch pt-4">
          {navigationOptions.map((option) => (
            <div
              key={option.id}
              className={`relative flex flex-1 grow flex-col items-center gap-0.5 pt-2 pb-1 ${option.isSelected ? "bg-white" : ""}`}
            >
              <img
                className="relative h-6 w-6"
                alt={option.label}
                src={option.icon}
              />

              <div
                className={`relative self-stretch pb-px text-center ${
                  option.isSelected
                    ? "text-primary-blue underline"
                    : option.isAvailable
                      ? "text-black"
                      : "text-primary-grey"
                }`}
              >
                {option.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trip information panel */}
        {/* <div className="w-full text-card-foreground shadow"> */}
        <div className="relative flex h-26 w-full justify-between self-stretch bg-light-blue pt-5 pr-5 pb-11 pl-5">
          <div className="h-9">
            <div className="flex">
              <div className="flex-col pr-4">
                <div className="w-full font-bold text-black text-xl">
                  {endTime}
                </div>
                <div className="-translate-y-2 w-full text-center">arrival</div>
              </div>
              <div className="flex-col pr-4">
                <div className="w-full text-center font-bold text-black text-xl">
                  {time}
                </div>
                <div className="-translate-y-2 w-full text-center">min</div>
              </div>
              <div className="flex-col">
                <div className="w-full text-center font-bold text-black text-xl">
                  {distance}
                </div>
                <div className="-translate-y-2 w-full text-center">ft</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-shadow inline-flex h-10 w-26 items-center justify-center rounded-full bg-[#31b777] font-medium text-sm"
            onClick={() => {
              startNav();
            }}
          >
            <span className="text-center text-white">GO</span>
          </button>
        </div>
      </div>
      // </div>
    );
  };

  const renderNavCard = () => {
    return (
      <div className="mt-8 ml-9 flex h-9">
        <div className="h-9">
          <div className="flex">
            <div className="flex-col pr-4">
              <div className="w-full font-bold text-black text-xl">
                {endTime}
              </div>
              <div className="-translate-y-2 w-full text-center">arrival</div>
            </div>
            <div className="flex-col pr-4">
              <div className="w-full text-center font-bold text-black text-xl">
                {time}
              </div>
              <div className="-translate-y-2 w-full text-center">min</div>
            </div>
            <div className="flex-col">
              <div className="w-full text-center font-bold text-black text-xl">
                {distance}
              </div>
              <div className="-translate-y-2 w-full text-center">ft</div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn-shadow absolute right-5 inline-flex h-10 w-26 items-center justify-center rounded-full bg-primary-red font-medium"
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
        className={`${listShown ? "shadow-2xl shadow-black" : "btn-shadow rounded-t-3xl"} h-46 overflow-auto bg-white shadow-lg`}
      >
        {isNavigating ? renderNavCard() : renderChooseCard()}
      </div>
    </div>
  );
};

export default NavCard;

import { useEffect, useState } from "react";
import navStackIcon from "@/assets/icons/nav/nav-stack.svg";
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

interface NavHeaderProps {
  isNavigating: boolean;
  startNav: () => void;
  toggleListShown: () => void;
  listShown: boolean;
}

const NavCard = ({
  isNavigating,
  startNav,
  toggleListShown,
  listShown,
}: NavHeaderProps) => {
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

  const { navPaths, setSrc, setDst } = useNavigationParams();

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

  const [yControl, setYControl] = useState(300);

  useEffect(() => {
    setYControl(isNavigating ? 64 : 0);
  }, [isNavigating]);

  const renderPathInfo = () => {
    return (
      <div className="h-9">
        <div className="flex">
          <div className="flex-col pr-4">
            <div className="w-full font-bold text-[min(1.25rem,5vw)] text-black">
              {endTime}
            </div>
            <div className="-translate-y-2 w-full text-center">arrival</div>
          </div>
          <div className="flex-col pr-4">
            <div className="w-full text-center font-bold text-[min(1.25rem,5vw)] text-black">
              {time}
            </div>
            <div className="-translate-y-2 w-full text-center">min</div>
          </div>
          <div className="flex-col">
            <div className="w-full text-center font-bold text-[min(1.25rem,5vw)] text-black">
              {distance}
            </div>
            <div className="-translate-y-2 w-full text-center">ft</div>
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

  const renderNavCard = () => {
    return (
      <div className="mt-8 ml-9 flex h-9 justify-between">
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

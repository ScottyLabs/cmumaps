import { useEffect, useState } from "react";
import forwardArrowIconBlack from "@/assets/icons/nav/forward-arrow-black.svg";
import forwardArrowIconGrey from "@/assets/icons/nav/forward-arrow-grey.svg";
import forwardArrowIconWhite from "@/assets/icons/nav/forward-arrow-white.svg";

const NavDirectionsList = ({ show }: { show: boolean }) => {
  interface DirectionProps {
    time: number;
  }

  const pastDirections = [
    { time: 30 },
    { time: 25 },
    { time: 20 },
    { time: 15 },
    { time: 10 },
    { time: 5 },
  ];
  const futureDirections = [
    { time: 5 },
    { time: 10 },
    { time: 15 },
    { time: 20 },
    { time: 25 },
    { time: 30 },
  ];
  const renderPastDirection = ({ time }: DirectionProps, i: number) => {
    return (
      <div className="px-12 py-6" key={i}>
        <div className="pb-3 text-light-grey">{time} MIN AGO</div>
        <hr className="border-light-grey" />
        <div className="flex pt-2">
          <div className="mr-5 font-bold font-lato text-[2rem] text-light-grey">
            500 ft
          </div>
          <img
            src={forwardArrowIconGrey}
            alt="forward"
            width={26}
            height={26}
          />
          <div className="ml-auto pt-3 font-bold font-lato text-[1rem] text-light-grey">
            Wean Hall
          </div>
        </div>
      </div>
    );
  };

  const renderFutureDirection = ({ time }: DirectionProps, i: number) => {
    return (
      <div className="px-12 py-6" key={i}>
        <div className="pb-3 text-nav-blue">IN {time} MIN</div>
        <hr className="border-nav-blue pb-2" />
        <div className="flex">
          <div className="mr-5 font-bold font-lato text-[2rem]">500 ft</div>
          <img
            src={forwardArrowIconBlack}
            alt="forward"
            width={26}
            height={26}
          />
          <div className="ml-auto pt-3 font-bold font-lato text-[1rem]">
            Wean Hall
          </div>
        </div>
        <div className="flex">
          <div className="mr-5 font-bold font-lato text-[2rem]">500 ft</div>
          <img
            src={forwardArrowIconBlack}
            alt="forward"
            width={26}
            height={26}
          />
          <div className="ml-auto pt-3 font-bold font-lato text-[1rem]">
            Wean Hall
          </div>
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
      {pastDirections.map(renderPastDirection)}
      <div className="btn-shadow sticky top-0 bottom-0 z-10 mt-6 mb-3 bg-primary-green px-12 pb-3">
        <div className="flex pt-2">
          <div className="mr-5 font-bold font-lato text-[2rem] text-white">
            500 ft
          </div>
          <img
            src={forwardArrowIconWhite}
            alt="forward"
            width={26}
            height={26}
          />
          <div className="ml-auto pt-3 font-bold font-lato text-[1rem] text-white">
            Wean Hall
          </div>
        </div>
      </div>
      {futureDirections.map(renderFutureDirection)}
    </div>
  );
};

export default NavDirectionsList;

// const NavOverlay = () => {
//   const navigationOptions = [
//     {
//       id: "fastest",
//       icon: "https://c.animaapp.com/mc2d479d5LjgzY/img/fastest.svg",
//       label: "Fastest",
//       isSelected: false,
//     },
//     {
//       id: "accessible",
//       icon: "https://c.animaapp.com/mc2d479d5LjgzY/img/outside.svg",
//       label: "Accessible",
//       isSelected: true,
//     },
//     {
//       id: "inside",
//       icon: "https://c.animaapp.com/mc2d479d5LjgzY/img/indoor.svg",
//       label: "Inside",
//       isSelected: false,
//     },
//     {
//       id: "outside",
//       icon: "https://c.animaapp.com/mc2d479d5LjgzY/img/outside.svg",
//       label: "Outside",
//       isSelected: false,
//     },
//   ];

//   return (
//     <div className="btn-shadow-dark fixed inset-x-0 bottom-0 z-50 overflow-auto rounded-t-3xl bg-white shadow-lg">
//       <div className="relative flex w-full items-center justify-center self-stretch px-0 pt-6 pb-[5px]">
//         {navigationOptions.map((option) => (
//           <div
//             key={option.id}
//             className={`relative flex flex-1 grow flex-col items-center gap-0.5 ${option.isSelected ? "bg-white" : ""}`}
//           >
//             <img
//               className="relative h-6 w-6"
//               alt={option.label}
//               src={option.icon}
//             />
//             <div
//               className={`relative self-stretch text-center text-xs ${
//                 option.id === "accessible"
//                   ? "text-[#1e86ff] underline"
//                   : option.id === "fastest"
//                     ? "text-[#bec1c6]"
//                     : "text-lightcolorbaseprimarydark"
//               }`}
//             >
//               {option.label}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

import useBoundStore from "@/store";
import { type ClassValue, clsx } from "clsx";
import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

// Frame component
const NavCard = () => {
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

  return (
    <div className="btn-shadow-dark fixed inset-x-0 bottom-0 z-50 overflow-auto rounded-t-3xl bg-white shadow-lg">
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
                    className="relative w-6 h-6"
                    alt={option.label}
                    src={option.icon}
                  />
                )}

                <div
                  className={`relative self-stretch font-body-2 font-[number:var(--body-2-font-weight)] text-center tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] [font-style:var(--body-2-font-style)] text-[length:var(--body-2-font-size)] ${
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
          <div className="rounded-xl border bg-card text-card-foreground shadow border-none rounded-none w-full">
            <div className="flex items-center justify-between pt-[19px] pb-[11px] px-[21px] relative self-stretch w-full flex-[0_0_auto] bg-[#f1f4fd] p-0">
              <div className="w-36 h-9">
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
                <div className="flex -translate-y-2">
                  <div className="w-full text-center">arrival</div>
                  <div className="w-full text-center">min</div>
                  <div className="w-full text-center">mi</div>
                </div>
              </div>

              <div className="inline-flex h-[39px] w-[104px] items-center justify-center rounded-full bg-[#31b777] font-medium text-sm shadow-[0px_4px_4px_#00000040] transition-colors hover:bg-[#2aa56a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <span className="text-center font-[number:var(--body-2-font-weight)] font-body-2 text-[length:var(--body-2-font-size)] text-white leading-[var(--body-2-line-height)] tracking-[var(--body-2-letter-spacing)] [font-style:var(--body-2-font-style)]">
                  GO
                </span>
              </div>
            </div>
          </div>

          {/* Bottom indicator */}
          <div className="relative flex h-[34px] w-full items-end justify-center self-stretch bg-[#f1f4fd] pb-2">
            <div className="relative h-[5px] w-[134px] rounded-[100px] bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavCard;

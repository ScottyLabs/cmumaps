import type { Building } from "@cmumaps/common";
import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useBoundStore from "@/store";
import FloorSwitcherCarouselMobile from "./FloorSwitcherCarouselMobile";

interface Props {
  building: Building;
  initialFloorLevel: string;
}

const FloorSwitcherDisplayMobile = ({ building, initialFloorLevel }: Props) => {
  const focusFloor = useBoundStore((state) => state.focusFloor);
  const floorIndex = building.floors.indexOf(initialFloorLevel);

  const draggableRegionRef = useRef<HTMLDivElement>(null);

  const progressValue = useMotionValue(floorIndex);

  const [startingTouchY, setStartingTouchY] = useState(0);
  const [startingProgressValue, setStartingProgressValue] = useState(0);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]?.clientY) {
      setStartingTouchY(e.touches[0]?.clientY);
      setStartingProgressValue(progressValue.get());
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]?.clientY) {
      progressValue.set(
        Math.max(
          0,
          Math.min(
            building.floors.length - 1,
            startingProgressValue -
              (e.touches[0]?.clientY - startingTouchY) / 50,
          ),
        ),
      );
    }
  };

  const onTouchEnd = () => {
    const targetFloorIndex = Math.round(progressValue.get());

    const controls = animate(progressValue, targetFloorIndex, {
      duration: Math.abs(progressValue.get() - targetFloorIndex) * 0.5,
      ease: "easeInOut",
      bounce: 0,
    });

    controls.then(() => {
      if (building.floors[targetFloorIndex]) {
        focusFloor({
          buildingCode: building.code,
          level: building.floors[targetFloorIndex],
        });
      }
    });

    return controls.stop;
  };

  //e.preventDefault can only be called in an active event listener
  useEffect(() => {
    const el = draggableRegionRef.current;
    if (!el) return;
    const handler = (e: TouchEvent) => {
      e.preventDefault();
    };
    el.addEventListener("touchmove", handler, { passive: false });
    return () => el.removeEventListener("touchmove", handler);
  }, []);

  return (
    <>
      <div
        className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 h-104 w-90"
        style={{ borderRadius: "50% / 50%" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        ref={draggableRegionRef}
      />
      <motion.div
        className="btn-shadow -translate-x-1/2 -translate-y-1/2 fixed top-1/2 h-52 w-45 bg-white/10 backdrop-blur-md"
        style={{ borderRadius: "50% / 50%" }}
      >
        <FloorSwitcherCarouselMobile
          building={building}
          progressValue={progressValue}
        />
      </motion.div>
    </>
  );
};

export default FloorSwitcherDisplayMobile;

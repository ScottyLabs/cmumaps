import { Building } from "@cmumaps/common";
import { motion, useTransform, animate } from "framer-motion";
import { MotionValue } from "motion/react";

import useBoundStore from "@/store";

interface FloorSwitcherButtonProps {
  building: Building;
  index: number;
  floor: string;
  progressValue: MotionValue<number>;
}

const FloorSwitcherButton = ({
  building,
  index,
  floor,
  progressValue,
}: FloorSwitcherButtonProps) => {
  const focusFloor = useBoundStore((state) => state.focusFloor);

  const offsetDistance = useTransform(
    () =>
      Math.max(0, Math.min(100, (progressValue.get() - index) * 25 + 50)) + "%",
  );

  const distCurveValue = () => {
    const dist = parseFloat(offsetDistance.get().replace("%", "")) / 100;
    return Math.max(0, Math.min(1, 2 - 20 * Math.abs(dist - 0.5)));
  };

  const opacity = useTransform(() => 0.5 + 0.5 * distCurveValue());

  const width = useTransform(() => 38 + distCurveValue() * 8);

  const height = useTransform(() => 38 + distCurveValue() * 8);

  const onClick = () => {
    const controls = animate(progressValue, index, {
      duration: 0.3,
      ease: "easeInOut",
      bounce: 0,
    });
    controls.then(() => {
      focusFloor({ buildingCode: building.code, level: floor });
    });
    return controls.stop;
  };

  return (
    <motion.div
      className="fixed top-1/2 flex h-[46px] w-[46px] translate-x-[89px] items-center justify-center text-white rounded-full"
      style={{
        borderRadius: "50% / 50%",
        backgroundColor: "#6F8FE3",
        offsetPath: 'path("M -30,70 L 0,70 A 56,70 0 1,0 0,-70 L -30, -70")',
        offsetDistance,
        opacity,
        width,
        height,
        offsetRotate: "0deg",
      }}
      key={index}
      onClick={onClick}
    >
      <div className="fixed">{floor}</div>
    </motion.div>
  );
};

interface DummyButtonProps {
  index: number;
  progressValue: MotionValue<number>;
}

const DummyButton = ({ index, progressValue }: DummyButtonProps) => {
  const offsetDistance = useTransform(
    () =>
      Math.max(0, Math.min(100, (progressValue.get() - index) * 25 + 50)) + "%",
  );

  return (
    <motion.div
      className="fixed top-1/2 flex h-[38px] w-[38px] translate-x-[89px] items-center justify-center text-white rounded-full"
      style={{
        backgroundColor: "rgb(179, 193, 232)",
        offsetPath: 'path("M -30,70 L 0,70 A 56,70 0 1,0 0,-70 L -30, -70")',
        offsetDistance,
        opacity: 0.5,
        offsetRotate: "0deg",
      }}
      key={index}
    ></motion.div>
  );
};

interface Props {
  building: Building;
  progressValue: MotionValue<number>;
}

const FloorSwitcherCarouselMobile = ({ building, progressValue }: Props) => {
  return (
    <>
      <DummyButton index={-1} progressValue={progressValue} />
      {building.floors.map((floor, index) => (
        <FloorSwitcherButton
          building={building}
          index={index}
          floor={floor}
          progressValue={progressValue}
          key={index}
        />
      ))}
      <DummyButton
        index={building.floors.length}
        progressValue={progressValue}
      />
    </>
  );
};

export default FloorSwitcherCarouselMobile;

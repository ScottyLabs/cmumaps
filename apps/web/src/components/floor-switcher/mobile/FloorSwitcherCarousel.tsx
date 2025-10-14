import type { Building } from "@cmumaps/common";
import { animate, type MotionValue, motion, useTransform } from "motion/react";
import { useEffect } from "react";
import $api from "@/api/client";
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
      `${Math.max(0, Math.min(100, (progressValue.get() - index) * 25 + 50))}%`,
  );

  useEffect(() => {
    offsetDistance.addDependent(progressValue);
  });

  const distCurveValue = () => {
    const val = Number.parseFloat(offsetDistance.get().replace("%", "")) / 100;
    const dist = 2 - 20 * Math.abs(val - 0.5);
    return Math.max(0, Math.min(1, dist));
  };

  const opacity = useTransform(() => 0.5 + 0.5 * distCurveValue());

  const width = useTransform(() => 38 + distCurveValue() * 8);

  const height = useTransform(() => 38 + distCurveValue() * 8);

  const boundingBoxSize = useTransform(() => 80 - distCurveValue() * 80);

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
      className="fixed top-1/2 flex translate-x-22 items-center justify-center rounded-full"
      style={{
        offsetPath: 'path("M -30,70 L 0,70 A 56,70 0 1,0 0,-70 L -30, -70")',
        offsetDistance,
        offsetRotate: "0deg",
        width: boundingBoxSize,
        height: boundingBoxSize,
      }}
      key={index}
      onClick={onClick}
    >
      <motion.div
        className="fixed flex items-center justify-center rounded-full text-white"
        style={{
          backgroundColor: "#6F8FE3",
          opacity,
          width,
          height,
        }}
      >
        <p>{floor}</p>
      </motion.div>
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
      `${Math.max(0, Math.min(100, (progressValue.get() - index) * 25 + 50))}%`,
  );

  return (
    <motion.div
      className="fixed top-1/2 flex translate-x-22 items-center justify-center rounded-full text-white"
      style={{
        backgroundColor: "#B3C1E8",
        offsetPath: 'path("M -30,70 L 0,70 A 56,70 0 1,0 0,-70 L -30, -70")',
        offsetDistance,
        opacity: 0.5,
        width: 38,
        height: 38,
        offsetRotate: "0deg",
      }}
      key={index}
    />
  );
};

interface Props {
  building: Building;
  progressValue: MotionValue<number>;
}

const FloorSwitcherCarouselMobile = ({ building, progressValue }: Props) => {
  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  const { data: buildings } = $api.useQuery("get", "/buildings");
  const currentBuilding = buildings?.[focusedFloor?.buildingCode ?? ""];
  const floors = currentBuilding?.floors ?? [];

  return (
    <>
      <DummyButton index={-1} progressValue={progressValue} />
      {floors.map((floor, index) => (
        <FloorSwitcherButton
          building={currentBuilding ?? building}
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

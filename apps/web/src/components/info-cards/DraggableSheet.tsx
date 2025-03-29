import { motion } from "motion/react";

import { useEffect, useMemo, useState } from "react";

import useLocationParams from "@/hooks/useLocationParams";
import { InfoCardStates, setInfoCardStatus } from "@/store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface Props {
  snapPoint: number; // the middle snap point
  children: React.ReactElement;
}

const DraggableSheet = ({ snapPoint, children }: Props) => {
  const dispatch = useAppDispatch();
  const { isCardOpen } = useLocationParams();
  console.log("isCardOpen", isCardOpen);
  const infoCardStatus = useAppSelector((state) => state.ui.infoCardStatus);

  // initial snap points
  const snapPoints = useMemo(() => {
    if (snapPoint != null) {
      return [-8, window.innerHeight - snapPoint, window.innerHeight - 145];
    } else {
      return [-8, window.innerHeight - 145];
    }
  }, [snapPoint]);

  const [snapIndex, setSnapIndex] = useState(1);

  // reset the card status when the card is reopened
  useEffect(() => {
    console.log("isCardOpen", isCardOpen);
    if (isCardOpen) {
      dispatch(setInfoCardStatus(InfoCardStates.HALF_OPEN));
      setSnapIndex(1);
    } else {
      setSnapIndex(0);
    }
  }, [dispatch, isCardOpen]);

  // update the snap index when the card status changes
  useEffect(() => {
    const snapIndex = Object.values(InfoCardStates).indexOf(infoCardStatus);
    setSnapIndex(snapIndex);
  }, [infoCardStatus]);

  return (
    <div className="absolute inset-0">
      <motion.div
        initial={{ y: -snapPoints[snapIndex]! }}
        animate={{ y: -snapPoints[snapIndex]! }}
        transition={{ duration: 1 }}
        drag="y"
        dragConstraints={{
          top: -snapPoints[snapPoints.length - 1]!,
          bottom: 0,
        }}
        dragElastic={1}
        onDragEnd={(e) => {
          console.log("drag end", e);
        }}
        className="flex flex-col rounded-t-xl bg-white text-center"
      >
        <div className="flex h-12 items-center justify-center rounded-t-xl">
          <div className="h-1 w-12 rounded-full bg-black" />
        </div>
        <div className="h-svh">{children}</div>
      </motion.div>
    </div>
  );
};

export default DraggableSheet;

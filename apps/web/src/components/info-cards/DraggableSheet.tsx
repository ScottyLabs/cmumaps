import { motion, PanInfo, useAnimation } from "motion/react";

import { useEffect, useMemo } from "react";

import useLocationParams from "@/hooks/useLocationParams";
import {
  setInfoCardStatus,
  CardStates,
  CardStatesList,
} from "@/store/features/cardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface Props {
  children: React.ReactElement;
}

const DraggableSheet = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const { isCardOpen } = useLocationParams();

  const controls = useAnimation();

  const cardStatus = useAppSelector((state) => state.card.cardStatus);
  const midSnapPoint = useAppSelector((state) => state.card.midSnapPoint);

  const snapIndex = useMemo(() => {
    return CardStatesList.indexOf(cardStatus);
  }, [cardStatus]);

  // inialize the snap points based on the mid snap point
  const snapPoints = useMemo(() => {
    if (midSnapPoint) {
      return [-100, midSnapPoint, 200];
    } else {
      return [-100, 200];
    }
  }, [midSnapPoint]);

  // updates the snap index when the card status changes
  useEffect(() => {
    controls.start({ y: -snapPoints[snapIndex]! });
  }, [cardStatus, controls, snapIndex, snapPoints]);

  // updates the snap points when the isCardOpen changes
  useEffect(() => {
    if (isCardOpen) {
      controls.start({ y: -snapPoints[1]! });
    } else {
      controls.start({ y: -snapPoints[0]! });
    }
  }, [isCardOpen, controls, snapPoints]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const infoCardStatus =
      info.velocity.y < 0 ? CardStates.HALF_OPEN : CardStates.COLLAPSED;
    dispatch(setInfoCardStatus(infoCardStatus));
  };

  return (
    <div className="absolute inset-0">
      <motion.div
        animate={controls}
        transition={{ duration: 0.5 }}
        drag="y"
        dragConstraints={{
          top: -snapPoints[snapPoints.length - 1]!,
          bottom: 0,
        }}
        dragElastic={1}
        onDragEnd={handleDragEnd}
        className="flex flex-col rounded-t-xl bg-white text-center"
      >
        <div className="flex h-12 items-center justify-center rounded-t-xl">
          <div className="h-1 w-12 rounded-full bg-black" />
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};

export default DraggableSheet;

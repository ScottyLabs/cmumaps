import { motion, PanInfo, useAnimation } from "motion/react";

import { useEffect, useMemo, useRef } from "react";

import useLocationParams from "@/hooks/useLocationParams";
import {
  setInfoCardStatus,
  CardStatesList,
  CardStates,
} from "@/store/features/cardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface Props {
  children: React.ReactElement;
}

const DraggableSheet = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const { isCardOpen } = useLocationParams();

  const controls = useAnimation();

  // contraint the children so it doesn't trigger the drag
  // needed when you want to scroll the children
  const childConstraint = useRef(null);

  const cardStatus = useAppSelector((state) => state.card.cardStatus);
  const snapPoints = useAppSelector((state) => state.card.snapPoints);

  const snapIndex = useMemo(() => {
    return CardStatesList.indexOf(cardStatus);
  }, [cardStatus]);

  // updates the snap index when the card status changes
  useEffect(() => {
    if (isCardOpen && snapPoints && snapPoints[snapIndex]) {
      controls.start({ y: -snapPoints[snapIndex] });
    }
  }, [controls, isCardOpen, snapIndex, snapPoints]);

  // updates the snap points when the isCardOpen changes
  useEffect(() => {
    if (isCardOpen) {
      dispatch(setInfoCardStatus(CardStates.HALF_OPEN));
    } else {
      dispatch(setInfoCardStatus(CardStates.COLLAPSED));
      controls.start({ y: 0 });
    }
  }, [controls, dispatch, isCardOpen, snapPoints]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!snapPoints) {
      return;
    }

    controls.set({ height: window.innerHeight });

    if (snapPoints[snapIndex]) {
      const newPos = snapPoints[snapIndex] - info.offset.y;
      const newPosAdj =
        newPos - Math.min(300, Math.max(-300, 400 * info.velocity.y));
      const closestSnap = snapPoints.reduce((prev, curr) =>
        Math.abs(curr! - newPosAdj) < Math.abs(prev! - newPosAdj) ? curr : prev,
      );

      const index = snapPoints.indexOf(closestSnap);
      if (CardStatesList[index]) {
        dispatch(setInfoCardStatus(CardStatesList[index]));
        controls.start({ y: -snapPoints[index]! });
      }
    }
  };

  // extend the height of the card based on the drag
  const handleDrag = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (snapPoints && snapPoints[snapIndex]) {
      const newPos = snapPoints[snapIndex] - info.offset.y;
      controls.set({ height: newPos + window.innerHeight });
    }
  };

  return (
    <div className="absolute inset-0">
      <motion.div
        animate={controls}
        transition={{ duration: 0.5 }}
        drag="y"
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        className="flex h-screen flex-col rounded-t-xl bg-white"
      >
        <div className="flex h-12 shrink-0 items-center justify-center rounded-t-xl">
          <div className="h-1 w-12 rounded-full bg-black" />
        </div>
        <div ref={childConstraint} className="flex flex-col overflow-hidden">
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={false}
            dragConstraints={childConstraint}
            className="flex flex-col overflow-hidden"
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DraggableSheet;

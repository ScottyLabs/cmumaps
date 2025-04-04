import { motion, PanInfo, useAnimation } from "motion/react";

import { useEffect, useMemo, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  const { isCardOpen } = useLocationParams();

  const controls = useAnimation();
  const childConstraint = useRef(null);

  const cardStatus = useAppSelector((state) => state.card.cardStatus);
  const snapPoints = useAppSelector((state) => state.card.snapPoints);

  const snapIndex = useMemo(() => {
    return CardStatesList.indexOf(cardStatus);
  }, [cardStatus]);

  // updates the card status when the isCardOpen changes
  useEffect(() => {
    if (isCardOpen) {
      dispatch(setInfoCardStatus(CardStates.HALF_OPEN));
    } else {
      dispatch(setInfoCardStatus(CardStates.COLLAPSED));
    }
  }, [controls, dispatch, isCardOpen]);

  // updates the snapping when isCardOpen or snapIndex changes
  useEffect(() => {
    if (snapPoints && snapPoints[snapIndex]) {
      if (isCardOpen) {
        controls.start({ y: -snapPoints[snapIndex] });
      } else {
        controls.start({ y: 0 });
      }
    }
  }, [controls, isCardOpen, snapIndex, snapPoints]);

  const handleUpdateHeight = () => {
    controls.set({ height: window.innerHeight });
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!snapPoints) {
      return;
    }

    // snapping logic
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

  const renderHandle = () => {
    return (
      <div className="flex h-12 shrink-0 items-center justify-between px-2">
        <div className="w-8" />
        <div className="h-1 w-12 rounded-full rounded-t-xl bg-black" />
        <IoIosClose title="Close" size={32} onClick={() => navigate("/")} />
      </div>
    );
  };

  const renderChildren = () => {
    // contraint the children so it doesn't trigger the drag
    // needed when you want to scroll the children
    return (
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
    );
  };

  return (
    <div className="absolute inset-0">
      <motion.div
        animate={controls}
        onAnimationComplete={handleUpdateHeight}
        transition={{ duration: 0.5 }}
        drag="y"
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        className="flex flex-col overflow-hidden rounded-t-xl bg-white"
      >
        {renderHandle()}
        {renderChildren()}
      </motion.div>
    </div>
  );
};

export default DraggableSheet;

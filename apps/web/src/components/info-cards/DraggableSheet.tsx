import { motion, PanInfo, useAnimation } from "motion/react";

import { useCallback, useEffect, useMemo } from "react";
// import { useDrag } from "react-use-gesture";

import useLocationParams from "@/hooks/useLocationParams";
import { setInfoCardStatus, CardStatesList } from "@/store/features/cardSlice";
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
  const bottomSnapPoint = useAppSelector((state) => state.card.bottomSnapPoint);

  const snapIndex = useMemo(() => {
    return CardStatesList.indexOf(cardStatus);
  }, [cardStatus]);

  // inialize the snap points based on the mid snap point
  const snapPoints = useMemo(() => {
    if (midSnapPoint) {
      return [bottomSnapPoint, midSnapPoint, screen.availHeight];
    } else {
      return [142, 300, screen.availHeight];
    }
  }, [bottomSnapPoint, midSnapPoint]);

  const snapTo = useCallback((index: number) => {
    controls.start({ y: -snapPoints![index]!, height: snapPoints![index]! + 500 });
  }, [controls, snapPoints]);


  // updates the snap index when the card status changes
  useEffect(() => {
    snapTo(snapIndex);
  }, [controls, snapIndex, snapPoints, snapTo]);


  

  // useEffect(() => 
  // {console.log(controls)}, [controls]);

  // updates the snap points when the isCardOpen changes
  useEffect(() => {
    if (isCardOpen) {
      dispatch(setInfoCardStatus("half-open"));
      controls.start({ y: -snapPoints[1]! });
    } else {
      dispatch(setInfoCardStatus("collapsed"));
      controls.start({ y: 0 });
    }
  }, [controls, dispatch, isCardOpen, snapPoints]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (snapPoints![snapIndex]) {
      const newPos = snapPoints![snapIndex] - info.offset.y;
      // console.log(info.point.y);

      const newPosAdj = newPos - Math.min(300, Math.max(-300, 400 * info.velocity.y));
      console.log("At: " + newPosAdj + " among " + snapPoints);

      const closestSnap = snapPoints.reduce((prev, curr) =>
        Math.abs(curr! - newPosAdj) < Math.abs(prev! - newPosAdj) ? curr : prev,
      );

      console.log("Closest: " + closestSnap);

      const index = snapPoints.indexOf(closestSnap);

      // const index = 2;

      // const index = info.velocity.y < 0 ? Math.min(snapIndex + 1, 2) : Math.max(snapIndex - 1, 0);

      console.log("EVENT");
      // console.log(info.point.y);
      

      if (CardStatesList[index]) {
        dispatch(setInfoCardStatus(CardStatesList[index]));
        snapTo(index);
        console.log("DISPATCH");
        console.log(CardStatesList[index]);
      }

      console.log(index);
      console.log(snapIndex);
      console.log(isCardOpen);
    }
  };

  const handleDrag = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const newPos = snapPoints![snapIndex]! - info.offset.y;
    controls.set({ height: newPos + 500 });
  }

  return (
    <div className="absolute inset-0">
      <motion.div
        animate={controls}
        transition={{ duration: 0.5 }}
        drag="y"
        // dragConstraints={{
        //   top: -snapPoints![snapPoints!.length - 1]!,
        //   bottom: -snapPoints![0]!,
        // }}
        // dragElastic={1}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        className="flex flex-col h-screen rounded-t-xl bg-white text-center"
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

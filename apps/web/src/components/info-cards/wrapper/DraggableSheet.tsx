import { motion, type PanInfo, useAnimation } from "motion/react";
import { useEffect, useMemo } from "react";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import { CardStates, CardStatesList } from "@/store/cardSlice";

interface Props {
  snapPoints: number[];
  children: React.ReactElement;
}

const DraggableSheet = ({ snapPoints, children }: Props) => {
  // Library hooks
  const navigate = useNavigate();
  const controls = useAnimation();

  // Global state
  const cardStatus = useBoundStore((state) => state.cardStatus);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);

  // Local state
  const snapIndex = useMemo(() => {
    return CardStatesList.indexOf(cardStatus);
  }, [cardStatus]);

  // Custom hooks
  const { isCardOpen } = useLocationParams();

  // updates the card status when the isCardOpen changes
  useEffect(() => {
    if (isCardOpen) {
      setCardStatus(CardStates.HALF_OPEN);
    } else {
      setCardStatus(CardStates.COLLAPSED);
    }
  }, [isCardOpen, setCardStatus]);

  // updates the snapping when isCardOpen or snapIndex changes
  useEffect(() => {
    if (isCardOpen) {
      if (snapPoints[snapIndex]) {
        controls.start({ y: -snapPoints[snapIndex] });
      }
    } else {
      controls.start({ y: 0 });
    }
  }, [controls, isCardOpen, snapIndex, snapPoints]);

  const focusedFloor = useBoundStore((state) => state.focusedFloor);
  /* biome-ignore lint/correctness/useExhaustiveDependencies: re-rendering whenever navigate
   * changes would lock draggableSheet in Collapsed state */
  useEffect(() => {
    if (focusedFloor) {
      setCardStatus(CardStates.COLLAPSED);
      navigate(`/${focusedFloor.buildingCode}`);
    }
  }, [focusedFloor, setCardStatus]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    // find the closest snap point based on the velocity and offset
    if (snapPoints[snapIndex]) {
      const newPos = snapPoints[snapIndex] - info.offset.y;
      const newPosAdj =
        newPos - Math.min(300, Math.max(-300, 400 * info.velocity.y));
      const closestSnap = snapPoints.reduce((prev, curr) =>
        Math.abs(curr - newPosAdj) < Math.abs(prev - newPosAdj) ? curr : prev,
      );

      const index = snapPoints.indexOf(closestSnap);
      if (CardStatesList[index]) {
        setCardStatus(CardStatesList[index]);
        if (snapPoints[index]) {
          controls.start({ y: -snapPoints[index] });
        }
      }
    }

    // update the height of the card
    controls.set({ height: window.innerHeight });
  };

  // extend the height of the card based on the drag
  const handleDrag = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (snapPoints[snapIndex]) {
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

  return (
    <div className="absolute inset-0">
      <motion.div
        animate={controls}
        transition={{ duration: 0.5 }}
        drag="y"
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        className="flex h-dvh flex-col overflow-hidden rounded-t-xl bg-white"
      >
        {renderHandle()}
        {children}
      </motion.div>
    </div>
  );
};

export default DraggableSheet;

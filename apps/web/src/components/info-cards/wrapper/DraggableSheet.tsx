import { motion, type PanInfo, useAnimation } from "motion/react";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import useLocationParams from "@/hooks/useLocationParams";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";
import useBoundStore from "@/store";
import { CardStates, CardStatesList } from "@/store/cardSlice";

interface Props {
  snapPoints: number[];
  children: React.ReactElement;
}

const DraggableSheet = ({ snapPoints, children }: Props) => {
  // Library hooks
  const navigate = useNavigateLocationParams();
  const controls = useAnimation();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Global state
  const cardStatus = useBoundStore((state) => state.cardStatus);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);
  const isZooming = useBoundStore((state) => state.isZooming);
  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  const { buildingCode } = useLocationParams();

  // Local state
  const snapIndex = useMemo(() => {
    return CardStatesList.indexOf(cardStatus);
  }, [cardStatus]);

  // Custom hooks
  const { isCardOpen, floor } = useLocationParams();

  // updates the card status when the isCardOpen changes
  useEffect(() => {
    if (isCardOpen && !floor && !focusedFloor) {
      setCardStatus(CardStates.HALF_OPEN);
    } else {
      setCardStatus(CardStates.COLLAPSED);
    }
  }, [isCardOpen, setCardStatus, floor, focusedFloor]);

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

  /* biome-ignore lint/correctness/useExhaustiveDependencies: re-rendering whenever navigate
   * changes would lock draggableSheet in Collapsed state */
  useEffect(() => {
    if (
      focusedFloor &&
      focusedFloor.buildingCode !== buildingCode &&
      !isZooming
    ) {
      navigate(`/${focusedFloor.buildingCode}`);
      setCardStatus(CardStates.COLLAPSED);
    }
  }, [focusedFloor, setCardStatus]);

  const [dst] = useQueryState("dst");

  if (dst) {
    return;
  }

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
    // controls.set({ height: window.innerHeight });
    if (sheetRef.current) {
      sheetRef.current.style.height = `${window.innerHeight}px`;
    }
  };

  // extend the height of the card based on the drag
  const handleDrag = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (snapPoints[snapIndex]) {
      const newPos = snapPoints[snapIndex] - info.offset.y;
      // controls.set({ height: newPos + window.innerHeight });
      if (sheetRef.current) {
        sheetRef.current.style.height = `${newPos + window.innerHeight}px`;
      }
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
        ref={sheetRef}
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

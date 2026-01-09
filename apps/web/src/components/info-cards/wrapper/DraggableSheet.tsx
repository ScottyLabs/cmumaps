import { motion, type PanInfo, useAnimation } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import { CardStates, CardStatesList } from "@/store/cardSlice";

interface Props {
  snapPoints: number[];
  children: React.ReactElement[] | React.ReactElement;
  onClose: () => void;
  onCollapse?: () => void;
}

const DraggableSheet = ({
  snapPoints,
  children,
  onClose,
  onCollapse,
}: Props) => {
  // Library hooks
  const navigate = useNavigate();
  const controls = useAnimation();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Global state
  const cardStatus = useBoundStore((state) => state.cardStatus);
  const setCardStatus = useBoundStore((state) => state.setCardStatus);
  const isZooming = useBoundStore((state) => state.isZooming);
  const focusedFloor = useBoundStore((state) => state.focusedFloor);

  // Local state
  const snapIndex = useMemo(() => {
    return CardStatesList.indexOf(cardStatus);
  }, [cardStatus]);

  // Custom hooks
  const { isCardOpen, floor, coordinate, buildingCode } = useLocationParams();

  // updates the card status when the isCardOpen changes
  // TODO: uncomment once eateries are listed
  // biome-ignore lint/correctness/useExhaustiveDependencies: will change once eateries are listed
  useEffect(() => {
    // if (isCardOpen && !floor && !focusedFloor && !coordinate) {
    //   setCardStatus(CardStates.HALF_OPEN);
    // } else {
    //   setCardStatus(CardStates.COLLAPSED);
    // }
    setCardStatus(CardStates.COLLAPSED);
  }, [isCardOpen, setCardStatus, floor, focusedFloor, coordinate]);

  // updates the snapping when isCardOpen or snapIndex changes
  useEffect(() => {
    if (isCardOpen) {
      if (snapPoints[snapIndex]) {
        controls.start({ y: -snapPoints[snapIndex] });
      }
    } else {
      controls.start({ y: -(snapPoints[0] ?? 0) });
    }
  }, [controls, isCardOpen, snapIndex, snapPoints]);

  useEffect(() => {
    controls.set({ y: window.innerHeight });
  }, []);

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

  // const { isNavOpen } = useNavigationParams();

  // if (isNavOpen) {
  //   return;
  // }

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
          controls.start(
            { y: -snapPoints[index] },
            {
              onComplete:
                closestSnap === -window.innerHeight ? onCollapse : () => {},
            },
          );
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
        <div className="h-[5px] w-14 rounded-full bg-surface-darker-background" />
        <IoIosClose
          title="Close"
          size={32}
          onClick={() => {
            controls.start(
              { y: window.innerHeight },
              {
                onComplete: onClose,
              },
            );
          }}
        />
      </div>
    );
  };

  return (
    <div className="absolute inset-0 h-0">
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

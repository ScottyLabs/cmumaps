import { useMemo, useState } from "react";

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
  const infoCardStatus = useAppSelector((state) => state.ui.infoCardStatus);

  // initial snap points
  const snapPoints = useMemo(() => {
    if (snapPoint != null) {
      return [window.innerHeight - 145, window.innerHeight - snapPoint, -8];
    } else {
      return [window.innerHeight - 145, -8];
    }
  }, [snapPoint]);

  const [snapIndex, setSnapIndex] = useState(1);
  const snapTo = (index: number) => {
    if (snapIndex == index) {
      return;
    }
    const closestSnap = snapPoints[index];
    api.start({ y: closestSnap });
    setSnapIndex(index);
    const status = Object.values(InfoCardStates)[index];
    if (status != null) {
      dispatch(setInfoCardStatus(status));
    }
  };

  useEffect(() => {
    if (isOpen) {
      snapTo(1);
    } else {
      snapTo(0);
    }
  }, [isOpen]);

  useEffect(() => {
    api.start({ y: snapPoints[snapIndex] });
  }, [children]);

  useEffect(() => {
    snapTo({ [COLLAPSED]: 0, [HALF_OPEN]: 1, [EXPANDED]: 2 }[infoCardStatus]);
  }, [infoCardStatus]);

  const bind = useDrag(
    ({ movement: [, oy], velocities, last }) => {
      const newPos = snapPoints[snapIndex] + oy;

      api.set({ y: Math.max(0, newPos) });

      if (last) {
        const newPosAdj =
          newPos + Math.min(400, Math.max(-400, 600 * velocities[1]));

        const closestSnap = snapPoints.reduce((prev, curr) =>
          Math.abs(curr - newPosAdj) < Math.abs(prev - newPosAdj) ? curr : prev,
        );

        api.start({ y: closestSnap });

        const closestSnapIndex = snapPoints.indexOf(closestSnap);
        setSnapIndex(closestSnapIndex);
        dispatch(
          setCardWrapperStatus(
            [COLLAPSED, HALF_OPEN, EXPANDED][closestSnapIndex],
          ),
        );
      }
    },
    { axis: "y" },
  );

  if (api == undefined) {
    return;
  }

  return (
    <div
      hidden={!isCardOpen}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
    >
      <animated.div style={{ y, pointerEvents: "auto" }}>
        <animated.div
          {...bind()}
          style={{
            touchAction: "none",
            cursor: "grab",
          }}
          className="flex h-12 items-center justify-center rounded-t-xl bg-white text-center"
        >
          <div className="flex h-12 items-center justify-center rounded-t-xl bg-white text-center">
            <div className="h-1 w-12 rounded-full bg-black"></div>
          </div>
        </animated.div>
        <animated.div className="h-svh bg-white">{children}</animated.div>
      </animated.div>
    </div>
  );
};

export default DraggableSheet;

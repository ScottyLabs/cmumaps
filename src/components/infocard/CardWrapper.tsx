import { useSpring, animated } from '@react-spring/web';

import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-use-gesture';

import {
  COLLAPSED,
  EXPANDED,
  HALF_OPEN,
  setCardWrapperStatus,
} from '@/lib/features/uiSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

interface DraggableSheetProps {
  snapPoint: number;
  children: React.ReactElement;
  isOpen: boolean;
}

function DraggableSheet({ snapPoint, children, isOpen }: DraggableSheetProps) {
  const cardWrapperStatus = useAppSelector(
    (state) => state.ui.cardWrapperStatus,
  );

  const [{ y }, api] = useSpring(() => {
    0;
  }); // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  const dispatch = useAppDispatch();

  let snapPoints;
  if (snapPoint != null) {
    snapPoints = [
      window.innerHeight - 45 - 100,
      window.innerHeight - snapPoint - 12,
      0,
    ];
  } else {
    snapPoints = [window.innerHeight - 45, 0];
  }

  const [snapPos, setSnapPos] = useState(window.innerHeight - 45);
  const [snapIndex, setSnapIndex] = useState(1);

  const snapTo = (index) => {
    const closestSnap = snapPoints[index];
    api.start({ y: closestSnap });
    setSnapPos(closestSnap);
    setSnapIndex(index);
  };

  useEffect(() => {
    const closestSnap = snapPoints[snapIndex];
    const closestSnapIndex = snapPoints.indexOf(closestSnap);
    dispatch(
      setCardWrapperStatus([COLLAPSED, HALF_OPEN, EXPANDED][closestSnapIndex]),
    );
  }, [dispatch, snapIndex, snapPoints]);

  useEffect(() => {
    if (isOpen) {
      snapTo(1);
    } else {
      snapTo(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (cardWrapperStatus == COLLAPSED) {
      snapTo(0);
    }
  }, [cardWrapperStatus]);

  const onClick = () => {
    snapTo((snapIndex + 1) % 3);
  };

  useEffect(() => {
    let closestSnap;
    if (!isOpen) {
      closestSnap = snapPoints[0];
      api.set({ y: closestSnap });
    } else {
      closestSnap = snapPoints[1];
      api.start({ y: closestSnap });
    }

    const closestSnapIndex = snapPoints.indexOf(closestSnap);
    setSnapIndex(closestSnapIndex);
    dispatch(
      setCardWrapperStatus([COLLAPSED, HALF_OPEN, EXPANDED][closestSnapIndex]),
    );
    setSnapPos(closestSnap);
  }, [api]);

  const bind = useDrag(
    ({ movement: [, oy], velocities, last }) => {
      const newPos = snapPos + oy;

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
        setSnapPos(closestSnap);
      }
    },
    { axis: 'y' },
  );
  api.start({ y: snapPos });

  if (api == undefined || (snapIndex == 1 && snapPos != snapPoints[1])) {
    snapTo(1);
  }

  return (
    <animated.div style={{ y, pointerEvents: 'auto' }}>
      <animated.div
        {...bind()}
        style={{
          touchAction: 'none',
          cursor: 'grab',
          zIndex: -1,
          transform: 'translate(0px,-8px)',
        }}
        onClick={onClick}
        className="content-top h-32 rounded-t-xl bg-white text-center"
      >
        <div className="flex h-12 items-center justify-center rounded-t-xl bg-white text-center">
          <div
            className="h-1 w-12 rounded-full bg-black"
            style={{ top: 10 }}
          ></div>
        </div>
      </animated.div>
      <animated.div
        id="DragSheetContent"
        className="h-svh bg-white"
        style={{ transform: 'translate(0px,-90px)' }}
      >
        {children}
      </animated.div>
    </animated.div>
  );
}

interface CardWrapperProps {
  snapPoint: number;
  children: React.ReactElement;
  isOpen: boolean;
}

const CardWrapper = ({ snapPoint, children, isOpen }: CardWrapperProps) => {
  const isMobile = useAppSelector((state) => state.ui.isMobile);

  if (isMobile) {
    return (
      <>
        {
          <div
            hidden={!isOpen}
            className="absolute inset-0"
            style={{ pointerEvents: 'none' }}
          >
            <DraggableSheet isOpen={isOpen} snapPoint={snapPoint}>
              {children}
            </DraggableSheet>
          </div>
        }
      </>
    );
  } else {
    return (
      <div className="flex w-96 flex-col overflow-hidden rounded-lg bg-white shadow-lg shadow-gray-400">
        {children}
      </div>
    );
  }
};

export default CardWrapper;

import { motion, useAnimation } from "motion/react";

import { useEffect, useRef, useState } from "react";

import useLocationParams from "@/hooks/useLocationParams";
import { setInfoCardStatus, CardStates } from "@/store/features/cardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface Props {
  children: React.ReactElement;
}

const DraggableSheet = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const { isCardOpen } = useLocationParams();

  const controls = useAnimation();

  const infoCardStatus = useAppSelector((state) => state.card.infoCardStatus);
  const childRef = useRef<HTMLDivElement>(null);
  const [childHeight, setChildHeight] = useState(0);

  useEffect(() => {
    if (childRef.current) {
      const childHeight = childRef.current.clientHeight;
      setChildHeight(childRef.current.clientHeight);
      controls.start({ y: -childHeight });
    }

    if (!isCardOpen) {
      controls.start({ y: 0 });
    }
  }, [controls, infoCardStatus, isCardOpen]);

  return (
    <div className="absolute inset-0">
      <motion.div
        animate={controls}
        transition={{ duration: 0.5 }}
        drag="y"
        dragConstraints={{
          top: -childHeight,
          bottom: 0,
        }}
        dragElastic={1}
        onDragEnd={(_e, info) => {
          const infoCardStatus =
            info.velocity.y < 0 ? CardStates.HALF_OPEN : CardStates.COLLAPSED;

          controls.start({ y: -childHeight });
          dispatch(setInfoCardStatus(infoCardStatus));
        }}
        className="flex flex-col rounded-t-xl bg-white text-center"
      >
        <div className="flex h-12 items-center justify-center rounded-t-xl">
          <div className="h-1 w-12 rounded-full bg-black" />
        </div>
        <div ref={childRef}>{children}</div>
      </motion.div>
    </div>
  );
};

export default DraggableSheet;

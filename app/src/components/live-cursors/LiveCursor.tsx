import { useEffect } from "react";
import { GiArrowCursor } from "react-icons/gi";
import { Path } from "react-konva";

import { LiveUser } from "../../../../shared/webSocketTypes";
import {
  CURSOR_INTERVAL,
  selectCursorInfoList,
  setCursorInfoList,
} from "../../store/features/liveCursor/liveCursorSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CursorNameRect from "./LiveCursorRect";

interface LiveCursorProps {
  floorCode: string;
  userSocketId: string;
  user: LiveUser;
  scale: number;
}

const LiveCursor = ({
  floorCode,
  userSocketId,
  user,
  scale,
}: LiveCursorProps) => {
  const dispatch = useAppDispatch();
  const cursorInfoList = useAppSelector((state) =>
    selectCursorInfoList(state, userSocketId),
  );

  // keep popping off the first element of cursor info list
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cursorInfoList && cursorInfoList.length > 1) {
        const socketId = userSocketId;
        const payload = { socketId, cursorInfoList: cursorInfoList.slice(1) };
        dispatch(setCursorInfoList(payload));
      }
    }, CURSOR_INTERVAL);

    return () => clearInterval(intervalId);
  }, [cursorInfoList, dispatch, floorCode, userSocketId]);

  if (!cursorInfoList || cursorInfoList.length === 0) {
    return;
  }

  const cursorPos = cursorInfoList[0].cursorPos;
  const renderCursor = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const path = GiArrowCursor({}).props.children[0].props.d;

    // scale the svg to the size of an actual cursor
    const pathScale = 0.04 / scale;

    return (
      <Path
        x={cursorPos.x - 4 / scale}
        y={cursorPos.y - 2 / scale}
        fill={user.color}
        data={path}
        scaleX={pathScale}
        scaleY={pathScale}
      />
    );
  };

  return (
    cursorPos && (
      <>
        {renderCursor()}
        <CursorNameRect user={user} cursorPos={cursorPos} scale={scale} />
      </>
    )
  );
};

export default LiveCursor;

import { useEffect } from "react";
import { GiArrowCursor } from "react-icons/gi";
import { Path } from "react-konva";

import { LiveUser } from "../../../../shared/websocket-types/userTypes";
import { CURSOR_UPDATE_RATE } from "../../hooks/useCursorTracker";
import {
  selectCursorInfos,
  setCursorInfos,
} from "../../store/features/liveCursor/liveCursorSlice";
import {
  moveNodeWithCursor,
  moveVertexWithCursor,
} from "../../store/features/liveCursor/liveCursorThunks";
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
  const cursorInfos = useAppSelector((state) =>
    selectCursorInfos(state, userSocketId),
  );

  // keep popping off the first element of cursor info list
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cursorInfos && cursorInfos.length > 1) {
        if ("nodeId" in cursorInfos[0]) {
          const payload = { floorCode, cursorInfo: cursorInfos[0] };
          dispatch(moveNodeWithCursor(payload));
        }

        if ("dragVertexInfo" in cursorInfos[0]) {
          const payload = { floorCode, cursorInfo: cursorInfos[0] };
          dispatch(moveVertexWithCursor(payload));
        }

        const socketId = userSocketId;
        const payload = { socketId, cursorInfos: cursorInfos.slice(1) };
        dispatch(setCursorInfos(payload));
      }
    }, CURSOR_UPDATE_RATE);

    return () => clearInterval(intervalId);
  }, [cursorInfos, dispatch, floorCode, userSocketId]);

  if (!cursorInfos || cursorInfos.length === 0) {
    return;
  }

  const cursorPos = cursorInfos[0].cursorPos;
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

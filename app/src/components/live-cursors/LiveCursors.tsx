import { memo } from "react";

import { useAppSelector } from "../../store/hooks";
import LiveCursor from "./LiveCursor";

interface LiveCursorsProps {
  floorCode: string;
  scale: number;
}

export const CURSOR_INTERVAL = 20;

const LiveCursorsComponent = ({ floorCode, scale }: LiveCursorsProps) => {
  const otherUsers = useAppSelector((state) => state.liveCursor.liveUsers);
  return Object.entries(otherUsers).map(([userSocketId, user]) => (
    <LiveCursor
      key={userSocketId}
      floorCode={floorCode}
      userSocketId={userSocketId}
      user={user}
      scale={scale}
    />
  ));
};

LiveCursorsComponent.displayName = "LiveCursors";

const LiveCursors = memo(LiveCursorsComponent);

export default LiveCursors;

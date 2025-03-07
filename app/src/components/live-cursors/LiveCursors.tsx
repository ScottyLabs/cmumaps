import { useAppSelector } from "../../store/hooks";
import { getSocketId } from "../../store/middleware/webSocketMiddleware";
import LiveCursor from "./LiveCursor";

interface LiveCursorsProps {
  floorCode: string;
  scale: number;
}

const LiveCursors = ({ floorCode, scale }: LiveCursorsProps) => {
  const users = useAppSelector((state) => state.liveCursor.liveUsers);
  const socketId = getSocketId();
  return Object.entries(users).map(
    ([userSocketId, user]) =>
      userSocketId !== socketId && (
        <LiveCursor
          key={userSocketId}
          floorCode={floorCode}
          userSocketId={userSocketId}
          user={user}
          scale={scale}
        />
      ),
  );
};

export default LiveCursors;

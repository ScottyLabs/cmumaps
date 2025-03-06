import { useUser } from "@clerk/clerk-react";

import { useEffect, useRef } from "react";

import { useAppDispatch } from "../store/hooks";
import {
  joinWebSocket,
  leaveWebSocket,
} from "../store/middleware/webSocketActions";

const getRandomColor = (): string => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

// Custom hook to join and leave the WebSocket connection
// Ignores ReactStrictMode
const useWebSocket = (floorCode?: string) => {
  const dispatch = useAppDispatch();
  const { user: clerkUser } = useUser();
  const isInitialRender = useRef<boolean>(true);

  useEffect(() => {
    if (clerkUser) {
      const userName = clerkUser.firstName || "";
      const user = { userName, color: getRandomColor() };
      dispatch(joinWebSocket(user));
    }

    return () => {
      // Skip cleanup on initial Strict Mode run
      if (isInitialRender.current) {
        isInitialRender.current = false;
        return;
      }

      dispatch(leaveWebSocket(floorCode));
    };
  }, [clerkUser, dispatch, floorCode]);
};

export default useWebSocket;

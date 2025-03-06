import { useUser } from "@clerk/clerk-react";

import { useEffect } from "react";

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

const useWebSocket = (floorCode?: string) => {
  const dispatch = useAppDispatch();
  const { user: clerkUser } = useUser();

  useEffect(() => {
    if (clerkUser) {
      const userName = clerkUser.firstName || "";
      const user = { userName, color: getRandomColor() };
      dispatch(joinWebSocket(user));
    }

    return () => {
      dispatch(leaveWebSocket(floorCode));
    };
  }, [clerkUser, dispatch, floorCode]);
};

export default useWebSocket;

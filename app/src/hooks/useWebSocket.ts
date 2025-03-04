import { useEffect } from "react";

import { useAppDispatch } from "../store/hooks";
import {
  joinWebSocket,
  leaveWebSocket,
} from "../store/middleware/webSocketActions";

const useWebSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(joinWebSocket());
    return () => {
      dispatch(leaveWebSocket());
    };
  }, [dispatch]);
};

export default useWebSocket;

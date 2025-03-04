import { useEffect } from "react";

import { useAppDispatch } from "../store/hooks";
import { joinWebSocket } from "../store/middleware/webSocketActions";

const useWebSocket = (floorCode?: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(joinWebSocket(floorCode));
  }, [dispatch, floorCode]);
};

export default useWebSocket;

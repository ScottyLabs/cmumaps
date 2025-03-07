import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { NodeInfo, PdfCoordinate } from "../../../shared/types";
import { useCreateNodeMutation } from "../store/api/nodeApiSlice";
import { ADD_NODE, GRAPH_SELECT, setMode } from "../store/features/modeSlice";
import {
  setShowRoomSpecific,
  setEditRoomLabel,
} from "../store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCursorPos } from "../utils/canvasUtils";

const useStageClickHandler = (
  floorCode: string,
  scale: number,
  offset: PdfCoordinate,
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const mode = useAppSelector((state) => state.mode.mode);

  const [createNode] = useCreateNodeMutation();

  //   const isValidClick = (clickedOnStage: boolean) => {
  //     // errors for each mode relative to stage clicking
  //     if (mode == POLYGON_ADD_VERTEX) {
  //       if (!clickedOnStage) {
  //         toast.error("Click on empty space!");
  //         return false;
  //       }
  //     } else if (mode == ADD_DOOR_NODE) {
  //       if (clickedOnStage) {
  //         // addDoorNodeErrToast();
  //         return false;
  //       }
  //     } else if (mode == ADD_EDGE || mode == DELETE_EDGE) {
  //       if (clickedOnStage) {
  //         toast.error("Click on another node!");
  //         return false;
  //       }
  //     }

  //     return true;
  //   };

  const handleCreateNode = (e: Konva.KonvaEventObject<MouseEvent>) => {
    getCursorPos(e, offset, scale, (pos) => {
      const nodeId = uuidv4();
      const nodeInfo: NodeInfo = {
        pos,
        neighbors: {},
        roomId: "",
        // roomId: findRoomId(rooms, pos),
      };

      const addToHistory = true;
      createNode({ floorCode, addToHistory, nodeId, nodeInfo });

      dispatch(setMode(GRAPH_SELECT));
    });
  };

  const handleDeselect = () => {
    navigate("?");
    dispatch(setShowRoomSpecific(false));
    dispatch(setEditRoomLabel(false));
    dispatch(setMode(GRAPH_SELECT));
  };

  return (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnStage = e.target == e.target.getStage();

    // create node
    if (mode == ADD_NODE) {
      if (!clickedOnStage) {
        toast.error("Click on empty space!");
      } else {
        handleCreateNode(e);
      }
    }

    // click to unselect a room or exit polygon editing or room label editing
    else if (clickedOnStage) {
      handleDeselect();
    }
  };
};

export default useStageClickHandler;

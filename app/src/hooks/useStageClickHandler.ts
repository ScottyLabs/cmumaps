import Konva from "konva";
import { v4 as uuidv4 } from "uuid";

import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { NodeInfo, PdfCoordinate } from "../../../shared/types";
import {
  useCreateEdgeMutation,
  useDeleteEdgeMutation,
} from "../store/api/edgeApiSlice";
import { useCreateNodeMutation } from "../store/api/nodeApiSlice";
import {
  ADD_DOOR_NODE,
  ADD_EDGE,
  ADD_NODE,
  DELETE_EDGE,
  GRAPH_SELECT,
  POLYGON_ADD_VERTEX,
  setMode,
} from "../store/features/modeSlice";
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
  const [createEdge] = useCreateEdgeMutation();
  const [deleteEdge] = useDeleteEdgeMutation();

  return (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnStage = e.target == e.target.getStage();

    // errors for each mode relative to stage clicking
    if (mode == ADD_NODE || mode == POLYGON_ADD_VERTEX) {
      if (!clickedOnStage) {
        toast.error("Click on empty space!");
        return;
      }
    } else if (mode == ADD_DOOR_NODE) {
      if (clickedOnStage) {
        // addDoorNodeErrToast();
      }
    } else if (mode == ADD_EDGE || mode == DELETE_EDGE) {
      if (clickedOnStage) {
        toast.error("Click on another node!");
        return;
      }
    }

    // create node
    if (mode == ADD_NODE) {
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
    }
    // click to unselect a room or exit polygon editing or room label editing
    else if (clickedOnStage) {
      navigate("?");
      dispatch(setShowRoomSpecific(false));
      dispatch(setEditRoomLabel(false));
      dispatch(setMode(GRAPH_SELECT));
    }
  };
};

export default useStageClickHandler;

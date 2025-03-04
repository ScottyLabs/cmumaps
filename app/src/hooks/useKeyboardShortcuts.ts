import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";

import { useDeleteNodeMutation } from "../store/api/nodeApiSlice";
import { redo, undo } from "../store/features/history/historySlice";
import {
  ADD_DOOR_NODE,
  ADD_NODE,
  GRAPH_SELECT,
  POLYGON_ADD_VERTEX,
  POLYGON_DELETE_VERTEX,
  selectEditPolygon,
  setMode,
} from "../store/features/modeSlice";
import {
  toggleShowEdges,
  toggleShowFile,
  toggleShowLabels,
  toggleShowNodes,
  toggleShowOutline,
  toggleShowPolygons,
} from "../store/features/visibilitySlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getSocketId } from "../store/middleware/webSocketMiddleware";

const useKeyboardShortcuts = (floorCode: string) => {
  const dispatch = useAppDispatch();

  const [deleteNode] = useDeleteNodeMutation();

  const [searchParam] = useSearchParams();
  const nodeIdSelected = searchParam.get("nodeId");

  const editPolygon = useAppSelector(selectEditPolygon);
  const shortcutsDisabled = useAppSelector(
    (state) => state.status.shortcutsDisabled,
  );

  useEffect(() => {
    if (shortcutsDisabled) {
      return;
    }

    const toastNodeNotSelectedErr = () => toast.error("Select a node first!");

    const handleKeyDown = (event: KeyboardEvent) => {
      // general keyboard shortcuts
      switch (event.key) {
        // visibility
        case "f":
          dispatch(toggleShowFile());
          break;
        case "o":
          dispatch(toggleShowOutline());
          break;
        case "g":
          dispatch(toggleShowNodes());
          dispatch(toggleShowEdges());
          break;
        case "l":
          dispatch(toggleShowLabels());
          break;
        case "p":
          dispatch(toggleShowPolygons());
          break;

        // quit
        case "q":
          dispatch(setMode(GRAPH_SELECT));
          break;

        // refetch data
        case "r":
          // invalidateCache();
          break;

        // edit history
        case "z":
          if (event.metaKey || event.ctrlKey) {
            if (event.shiftKey) {
              dispatch(redo());
            } else {
              dispatch(undo());
            }
          }
          break;
      }

      if (editPolygon) {
        // polygon keyboard shortcuts
        switch (event.key) {
          case "d":
            dispatch(setMode(POLYGON_DELETE_VERTEX));
            break;
          case "v":
            dispatch(setMode(POLYGON_ADD_VERTEX));
            break;
        }
      } else {
        // graph keyboard shortcuts
        switch (event.key) {
          // graph
          case "n":
            dispatch(setMode(ADD_NODE));
            break;
          case "e":
            // if (nodeIdSelected) {
            //   dispatch(setMode(ADD_EDGE));
            // } else {
            //   toastNodeNotSelectedErr();
            // }
            break;
          case "d":
            // if (nodeIdSelected) {
            //   dispatch(setMode(DELETE_EDGE));
            // } else {
            //   toastNodeNotSelectedErr();
            // }
            break;
          case "m":
            // if (nodes && rooms) {
            //   calcMst(nodes, rooms, router, dispatch);
            // }
            break;

          // delete or backspace to delete a node
          case "Backspace":
          case "Delete": {
            const socketId = getSocketId();
            if (nodeIdSelected && socketId) {
              const addToHistory = true;
              deleteNode({
                socketId,
                floorCode,
                addToHistory,
                nodeId: nodeIdSelected,
              });
            } else {
              toastNodeNotSelectedErr();
            }
            break;
          }

          case "w":
            dispatch(setMode(ADD_DOOR_NODE));
            break;

          // enters polygon editing mode
          case "v":
            // if (nodeIdSelected) {
            //   dispatch(setMode(POLYGON_ADD_VERTEX));
            // }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    dispatch,
    deleteNode,
    editPolygon,
    floorCode,
    nodeIdSelected,
    shortcutsDisabled,
  ]);
};

export default useKeyboardShortcuts;

import { v4 as uuidv4 } from "uuid";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";

import { useInvalidateCacheMutation } from "../store/api/floorDataApiSlice";
import { useDeleteNodeMutation } from "../store/api/nodeApiSlice";
import { redo, undo } from "../store/features/history/historyThunks";
import {
  ADD_DOOR_NODE,
  ADD_EDGE,
  ADD_NODE,
  DELETE_EDGE,
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

const useKeyboardShortcuts = (floorCode: string) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [invalidateCache] = useInvalidateCacheMutation();
  const [deleteNode] = useDeleteNodeMutation();

  const [searchParam] = useSearchParams();
  const selectedNodeId = searchParam.get("nodeId");

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
          invalidateCache();
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
            if (selectedNodeId) {
              dispatch(setMode(ADD_EDGE));
            } else {
              toastNodeNotSelectedErr();
            }
            break;
          case "d":
            if (selectedNodeId) {
              dispatch(setMode(DELETE_EDGE));
            } else {
              toastNodeNotSelectedErr();
            }
            break;
          case "m":
            // if (nodes && rooms) {
            //   calcMst(nodes, rooms, router, dispatch);
            // }
            break;

          // delete or backspace to delete a node
          case "Backspace":
          case "Delete": {
            if (selectedNodeId) {
              const addToHistory = uuidv4();
              navigate("?");
              deleteNode({
                floorCode,
                batchId: addToHistory,
                nodeId: selectedNodeId,
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
            // if (selectedNodeId) {
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
    selectedNodeId,
    shortcutsDisabled,
    invalidateCache,
    navigate,
  ]);
};

export default useKeyboardShortcuts;

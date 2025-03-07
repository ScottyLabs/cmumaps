import { toast } from "react-toastify";

import { edgeApiSlice } from "../../api/edgeApiSlice";
import { nodeApiSlice } from "../../api/nodeApiSlice";
import { AppDispatch } from "../../store";
import { createAppAsyncThunk } from "../../withTypes";
import { Edit } from "./historyTypes";

const applyEdit = (edit: Edit, dispatch: AppDispatch) => {
  switch (edit.endpoint) {
    case "createNode":
      dispatch(nodeApiSlice.endpoints.createNode.initiate(edit.arg)).unwrap();
      break;
    case "deleteNode":
      dispatch(nodeApiSlice.endpoints.deleteNode.initiate(edit.arg)).unwrap();
      break;
    case "updateNode":
      dispatch(nodeApiSlice.endpoints.updateNode.initiate(edit.arg)).unwrap();
      break;
    case "createEdge":
      dispatch(edgeApiSlice.endpoints.createEdge.initiate(edit.arg)).unwrap();
      break;
    case "deleteEdge":
      dispatch(edgeApiSlice.endpoints.deleteEdge.initiate(edit.arg)).unwrap();
      break;
    default:
      toast.error("Unimplemented edit type!");
  }
};

export const undo = createAppAsyncThunk(
  "history/undo",
  (_, { dispatch, getState }) => {
    try {
      const historyState = getState().history;
      const editIndex = historyState.editIndex;
      if (editIndex == -1) {
        toast.warn("Can't undo anymore!");
        return Promise.reject();
      }
      // apply the reversed edit
      const reversedEdit = historyState.reversedEditHistory[editIndex];
      applyEdit(reversedEdit, dispatch);
    } catch (error) {
      toast.error("Failed to undo change!");
      console.error("Error undoing:", error);
      return Promise.reject();
    }
  },
);

export const redo = createAppAsyncThunk(
  "history/redo",
  (_, { dispatch, getState }) => {
    try {
      const historyState = getState().history;
      const editIndex = historyState.editIndex;
      if (editIndex === historyState.editHistory.length) {
        toast.warn("Can't redo anymore!");
        return Promise.reject();
      }
      // apply the edit
      const edit = historyState.editHistory[editIndex];
      applyEdit(edit, dispatch);
    } catch (error) {
      toast.error("Failed to redo change!");
      console.error("Error redoing:", error);
      return Promise.reject();
    }
  },
);

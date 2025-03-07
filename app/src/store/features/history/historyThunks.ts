import { toast } from "react-toastify";

import { edgeApiSlice } from "../../api/edgeApiSlice";
import { nodeApiSlice } from "../../api/nodeApiSlice";
import { AppDispatch } from "../../store";
import { createAppAsyncThunk } from "../../withTypes";
import { setEditIndex } from "./historySlice";
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
      let editIndex = historyState.editIndex;
      if (editIndex == -1) {
        toast.warn("Can't undo anymore!");
        return Promise.reject();
      }

      // keep appling reverse edits in the same batch
      const batchId = historyState.batchIds[editIndex];
      while (
        editIndex < historyState.reversedEditHistory.length &&
        historyState.batchIds[editIndex] === batchId
      ) {
        const edit = historyState.reversedEditHistory[editIndex];
        applyEdit(edit, dispatch);
        editIndex--;
      }

      dispatch(setEditIndex(editIndex));
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
      let editIndex = historyState.editIndex + 1;

      if (editIndex === historyState.editHistory.length) {
        toast.warn("Can't redo anymore!");
        return Promise.reject();
      }

      // keep applying edits in the same batch
      const batchId = historyState.batchIds[editIndex];
      while (
        editIndex < historyState.editHistory.length &&
        historyState.batchIds[editIndex] === batchId
      ) {
        const edit = historyState.editHistory[editIndex];
        applyEdit(edit, dispatch);
        editIndex++;
      }

      dispatch(setEditIndex(editIndex - 1));
    } catch (error) {
      toast.error("Failed to redo change!");
      console.error("Error redoing:", error);
      return Promise.reject();
    }
  },
);

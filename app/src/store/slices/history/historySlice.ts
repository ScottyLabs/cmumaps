import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

import { nodeApiSlice } from "../../api/nodeApiSlice";
import { AppDispatch } from "../../store";
import { createAppAsyncThunk } from "../../withTypes";
import { Edit, EditPair } from "../historyTypes";

const MAX_UNDO_LIMIT = 50;

interface HistoryState {
  editHistory: Edit[];
  reversedEditHistory: Edit[];
  editIndex: number; // index of the edit to undo
}

const initialState: HistoryState = {
  editHistory: [],
  reversedEditHistory: [],
  editIndex: -1,
};

const applyEdit = (edit: Edit, dispatch: AppDispatch) => {
  switch (edit.endpoint) {
    case "createNode":
      dispatch(nodeApiSlice.endpoints.createNode.initiate(edit.arg)).unwrap();
      break;
    case "deleteNode":
      dispatch(nodeApiSlice.endpoints.deleteNode.initiate(edit.arg)).unwrap();
      break;
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

const getUpdatedHistory = (history: Edit[], edit: Edit, index: number) => {
  const updatedHistory = [...history.slice(0, index + 1), edit];
  // Trim the history arrays to maintain the maximum undo limit
  return updatedHistory.slice(-MAX_UNDO_LIMIT);
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addEditToHistory(state, action: PayloadAction<EditPair>) {
      const edit = action.payload.edit;
      const reverseEdit = action.payload.reverseEdit;

      // Update the history arrays with the new edit
      state.editHistory = getUpdatedHistory(
        state.editHistory,
        edit,
        state.editIndex + 1,
      );

      state.reversedEditHistory = getUpdatedHistory(
        state.reversedEditHistory,
        reverseEdit,
        state.editIndex + 1,
      );

      // Update the edit index
      state.editIndex = state.editHistory.length - 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(undo.fulfilled, (state) => {
      state.editIndex--;
    });
    builder.addCase(redo.pending, (state) => {
      state.editIndex++;
    });
    builder.addCase(redo.rejected, (state) => {
      state.editIndex--;
    });
  },
});

export const { addEditToHistory } = historySlice.actions;
export default historySlice.reducer;

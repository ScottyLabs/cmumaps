import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { redo, undo } from "./historyThunks";
import { Edit, EditPair } from "./historyTypes";

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

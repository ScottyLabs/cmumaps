import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Graph, Mst } from "../../../../shared/types";

interface DataState {
  nodes: Graph | null;
  mst: Mst | null;
}

const initialState: DataState = {
  nodes: null,
  mst: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setNodes(state, action) {
      state.nodes = action.payload;
    },

    setMst(state, action: PayloadAction<Mst | null>) {
      state.mst = action.payload;
    },
  },
});

export const { setNodes, setMst } = dataSlice.actions;
export default dataSlice.reducer;

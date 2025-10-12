import { createSlice } from "@reduxjs/toolkit";

interface VisibilityState {
  showPdf: boolean;
  showOutline: boolean;
  showNodes: boolean;
  showEdges: boolean;
  showLabels: boolean;
  showPolygons: boolean;
}

const initialState: VisibilityState = {
  showPdf: false,
  showOutline: true,
  showNodes: true,
  showEdges: true,
  showLabels: false,
  showPolygons: true,
};

const visibilitySlice = createSlice({
  name: "visibility",
  initialState,
  reducers: {
    toggleShowPdf(state) {
      state.showPdf = !state.showPdf;
    },
    toggleShowOutline(state) {
      state.showOutline = !state.showOutline;
    },
    toggleShowNodes(state) {
      state.showNodes = !state.showNodes;
    },
    toggleShowEdges(state) {
      state.showEdges = !state.showEdges;
    },
    toggleShowLabels(state) {
      state.showLabels = !state.showLabels;
    },
    toggleShowPolygons(state) {
      state.showPolygons = !state.showPolygons;
    },

    toggleShowGraph(state) {
      state.showNodes = !state.showNodes;
      state.showEdges = !state.showEdges;
    },
  },
});

export const {
  toggleShowPdf,
  toggleShowOutline,
  toggleShowNodes,
  toggleShowEdges,
  toggleShowLabels,
  toggleShowPolygons,
  toggleShowGraph,
} = visibilitySlice.actions;
export default visibilitySlice.reducer;

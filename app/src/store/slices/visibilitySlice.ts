import { createSlice } from '@reduxjs/toolkit';

interface VisibilityState {
  showFile: boolean;
  showOutline: boolean;
  showNodes: boolean;
  showEdges: boolean;
  showLabels: boolean;
  showPolygons: boolean;
}

const initialState: VisibilityState = {
  showFile: true,
  showOutline: true,
  showNodes: true,
  showEdges: true,
  showLabels: false,
  showPolygons: false,
};

const visibilitySlice = createSlice({
  name: 'visibility',
  initialState,
  reducers: {
    toggleShowFile(state) {
      state.showFile = !state.showFile;
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
  toggleShowFile,
  toggleShowOutline,
  toggleShowNodes,
  toggleShowEdges,
  toggleShowLabels,
  toggleShowPolygons,
  toggleShowGraph,
} = visibilitySlice.actions;
export default visibilitySlice.reducer;

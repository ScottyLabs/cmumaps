import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const eventTracks = [
  "CMU Tradition",
  "Food",
  "Awards/Celebration",
  "Exhibit/Tour",
  "Health/Wellness",
  "Alumni",
  "Performance",
];

export const eventReqs = ["Registration", "Fee", "Limited"];
interface EventState {
  selectedTracks: string[];
  selectedReqs: string[];
}

const initialState: EventState = {
  selectedTracks: [],
  selectedReqs: [],
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setSelectedTracks(state, action: PayloadAction<string[]>) {
      state.selectedTracks = action.payload;
    },
    setSelectedReqs(state, action: PayloadAction<string[]>) {
      state.selectedReqs = action.payload;
    },
  },
});

export const { setSelectedTracks, setSelectedReqs } = eventSlice.actions;
export default eventSlice.reducer;

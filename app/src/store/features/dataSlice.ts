import { Mst } from "@cmumaps/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataState {
  mst: Mst | null;
}

const initialState: DataState = {
  mst: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setMst(state, action: PayloadAction<Mst | null>) {
      state.mst = action.payload;
    },
  },
});

export const { setMst } = dataSlice.actions;
export default dataSlice.reducer;

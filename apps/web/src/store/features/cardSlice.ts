import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const CardStates = {
  COLLAPSED: "collapsed",
  HALF_OPEN: "half-open",
  EXPANDED: "expanded",
} as const;

export const CardStatesList = Object.values(CardStates);

export type CardStatus = (typeof CardStates)[keyof typeof CardStates];

interface CardState {
  midSnapPoint: number | null;
  infoCardStatus: CardStatus;
}

const initialState: CardState = {
  midSnapPoint: null,
  infoCardStatus: CardStates.HALF_OPEN,
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setInfoCardStatus(state, action: PayloadAction<CardStatus>) {
      state.infoCardStatus = action.payload;
    },
    setMidSnapPoint(state, action: PayloadAction<number>) {
      state.midSnapPoint = action.payload;
    },
  },
  selectors: {
    selectCardCollapsed: (state) =>
      state.infoCardStatus === CardStates.COLLAPSED,
  },
});

export const { setInfoCardStatus, setMidSnapPoint } = cardSlice.actions;
export const { selectCardCollapsed } = cardSlice.selectors;
export default cardSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const CardStates = {
  COLLAPSED: "collapsed",
  HALF_OPEN: "half-open",
  EXPANDED: "expanded",
} as const;

export const CardStatesList = Object.values(CardStates);

export type CardStatus = (typeof CardStates)[keyof typeof CardStates];

interface CardState {
  cardStatus: CardStatus;
}

const initialState: CardState = {
  cardStatus: CardStates.HALF_OPEN,
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setInfoCardStatus(state, action: PayloadAction<CardStatus>) {
      state.cardStatus = action.payload;
    },
  },
  selectors: {
    selectCardCollapsed: (state) => state.cardStatus === CardStates.COLLAPSED,
  },
});

export const { setInfoCardStatus } = cardSlice.actions;
export const { selectCardCollapsed } = cardSlice.selectors;
export default cardSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ID } from '../../../../shared/types';

interface LockState {
  /**
   * Lock for each room. 0 if unlocked, otherwise locked.
   * The user can write to a room whenver they want.
   * `locked` is used to indicate that a WebSocket patch is being overwritten
   * since the user edited (overwrote) the room without knowing the patch.
   */
  roomLocks: Record<ID, number>;
}

const initialState: LockState = {
  roomLocks: {},
};

const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    lockRoom(state, action: PayloadAction<string>) {
      state.roomLocks[action.payload] = state.roomLocks[action.payload] || 0;
      state.roomLocks[action.payload]++;
    },
    unlockRoom(state, action: PayloadAction<string>) {
      state.roomLocks[action.payload]--;
    },
  },
});

export const { lockRoom, unlockRoom } = lockSlice.actions;
export default lockSlice.reducer;

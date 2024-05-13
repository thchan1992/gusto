import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface History {
//   history: string[];
// }

const initialState: string[] = [];

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addHistory(state, action: PayloadAction<string>) {
      state.push(action.payload);
    },
    removeHistory(state, action: PayloadAction<void>) {
      state.pop();
    },
  },
});

export const { addHistory, removeHistory } = historySlice.actions;

export default historySlice.reducer;

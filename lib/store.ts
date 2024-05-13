import { configureStore } from "@reduxjs/toolkit";
import historySlice from "./features/history/historySlice";
import quizListSlice from "./features/quizList/quizListSlice";

export const store = configureStore({
  reducer: {
    history: historySlice,
    quizList: quizListSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

import { Quiz } from "@/lib/types/Quiz";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Quiz[] = [
  {
    _id: "string",
    isFirst: true,
    question: "string1",
    imageUrl: "string",
    options: [{ text: "string", nextQuizId: "string" }],
    troubleShootId: "",
    createdBy: "",
  },
];

const quizListSlice = createSlice({
  name: "quizList",
  initialState,
  reducers: {
    addQuizList(state, action: PayloadAction<Quiz[]>) {
      return action.payload;
    },
  },
});
export const { addQuizList } = quizListSlice.actions;

export default quizListSlice.reducer;

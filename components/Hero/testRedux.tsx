"use client";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { RootState } from "@/lib/store";
import { addQuizList } from "@/lib/features/quizList/quizListSlice";
import Quiz from "@/lib/models/Quiz";

export const TestRedux = () => {
  const quizList = useSelector((state: RootState) => state.quizList);
  const dispatch = useDispatch();
  return (
    <div>
      <button
        onClick={() => {
          dispatch(
            addQuizList([
              {
                _id: "x",
                isFirst: false,
                question: "string2",
                imageUrl: "string",
                options: [{ text: "string", nextQuizId: "string" }],
              },
            ])
          );
        }}
      >
        add
      </button>
      {quizList.map((item, i) => {
        return <div key={i}>{item.question}</div>;
      })}
    </div>
  );
};

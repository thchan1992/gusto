import React from "react";

import { Quiz } from "@/lib/types/Quiz";

export const QuestionCard = ({
  currentQuestion,
}: {
  currentQuestion: Quiz;
}) => {
  return (
    <div className="card w-full bg-base-100 shadow-xl p-1 m-4">
      {currentQuestion !== null ? (
        <div className="card-body">
          <h2 className="card-title">Question</h2>
          <div className="card-actions justify-end">
            <h1 className="break-words">{currentQuestion.question}</h1>
          </div>
        </div>
      ) : (
        <div className="card-body">
          <h2 className="card-title">This troubleshooter has no Question</h2>
          <div className="card-actions justify-end"></div>
        </div>
      )}
    </div>
  );
};

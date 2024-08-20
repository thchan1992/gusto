import { Quiz } from "@/lib/types/Quiz";
import React from "react";

export const OptionsList = ({
  currentQuestion,
  questionList,
  setHistory,
  setCurrentQuestion,
}: {
  currentQuestion: Quiz;
  questionList: Quiz[];
  setHistory: React.Dispatch<React.SetStateAction<Quiz[]>>;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Quiz>>;
}) => {
  return (
    <>
      {currentQuestion !== null &&
        currentQuestion.options.map((item, i) => {
          return (
            <div
              onClick={() => {
                if (item.nextQuizId !== undefined) {
                  const nextQuestion = questionList.find(
                    (quest: Quiz) => quest._id === item.nextQuizId
                  );

                  if (nextQuestion) {
                    setHistory((prev) => [...prev, currentQuestion]);
                    setCurrentQuestion(nextQuestion);
                  }
                } else {
                  console.log("the end of the troubleshoot");
                }
              }}
              key={i}
              className="w-full bordered rounded-xl shadow-xl p-4 m-4 bg-base-200 hover:bg-base-300 cursor-pointer hover:border-thirdColor"
            >
              Option {i + 1}: {item.text}
            </div>
          );
        })}
    </>
  );
};

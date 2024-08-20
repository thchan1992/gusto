import { Quiz } from "@/lib/types/Quiz";
import React from "react";

export const QuestionForm = ({
  questionList,
  token,
  questionText,
  setQuestionText,
  handleAddAnswer,
  panelStatus,
}: {
  questionList: Quiz[];
  token: string;
  questionText: string;
  setQuestionText: (value: React.SetStateAction<string>) => void;
  handleAddAnswer: () => Promise<void>;
  panelStatus: string;
}) => {
  return (
    <div className="">
      <h1 className="mt-2 font-bold text-black">Question title</h1>
      <div className="flex flex-row items-center justify-items-center">
        {questionList.length < 10 || token !== null ? (
          <div className="flex w-full items-center">
            <input
              type="text"
              name="questionText"
              placeholder="Question"
              className="w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-fifthColor dark:shadow-signUp"
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
              }}
            />
          </div>
        ) : (
          <div>
            {questionList.length} Please pay now to add more question or, remove
            some question and refresh the page.
          </div>
        )}
        <div className="ml-1 py-4">
          <button
            className="btn btn-info"
            disabled={questionText === "" ? true : false}
            onClick={handleAddAnswer}
          >
            {panelStatus === "NORMAL" ? "new question" : "complete"}
          </button>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { UploadForm } from "./S3UploadForm";
import { Quiz } from "@/lib/types/Quiz";

export const ModifyOption = ({
  panelStatus,
  SET_ANSWER,
  handleFileUrlChange,
  answerText,
  setAnswerText,
  setOptionList,
  answerLink,
  setAnswerLink,
  questionList,
}: {
  panelStatus: string;
  SET_ANSWER: string;
  handleFileUrlChange: (url: string) => void;
  answerText: string;
  setAnswerText: (value: React.SetStateAction<string>) => void;
  setOptionList: (
    value: React.SetStateAction<
      {
        text: string;
        nextQuizId: string;
      }[]
    >
  ) => void;
  answerLink: string;
  setAnswerLink: (value: React.SetStateAction<string>) => void;
  questionList: Quiz[];
}) => {
  return (
    <div>
      {panelStatus === SET_ANSWER && (
        <>
          <h1 className="mt-2 font-bold text-black">Image for the question</h1>
          <UploadForm onFileUrlChange={handleFileUrlChange} />
          <div className="w-full rounded-md border-2 border-primaryColor p-1">
            <h1 className="mt-2 font-bold text-black">Question title</h1>
            <div className="flex flex-row">
              <input
                type="text"
                name="answerText"
                placeholder="Answer"
                className="input input-bordered input-info mb-3 mr-1 w-full"
                value={answerText}
                onChange={(e) => {
                  setAnswerText(e.target.value);
                }}
              />
              <button
                className="btn btn-info"
                onClick={() => {
                  setOptionList((prev) => [
                    ...prev,
                    { text: answerText, nextQuizId: answerLink },
                  ]);
                  //add more answer
                  setAnswerLink("");
                  setAnswerText("");
                }}
              >
                add answer
              </button>
            </div>
            <select
              className="select select-bordered w-full"
              value={answerLink}
              onChange={(e) => {
                setAnswerLink(e.target.value);
              }}
            >
              <option value="" disabled>
                Answer
              </option>
              {questionList.map((item, i) => {
                return (
                  <option key={i} value={item._id}>
                    {item.question}
                  </option>
                );
              })}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

import React from "react";
import { FirstQuestionBadge } from "./FirstQuestionBadge";
import { Quiz } from "@/lib/types/Quiz";
import Button from "../Button";
export const QuestionList = ({
  questionList,
  panelStatus,
  NORMAL,
  setSelectedQuestion,
  setVisble,
  setShowDeleteConfirmation,
  setDeleteItem,
}: {
  questionList: Quiz[];
  panelStatus: string;
  NORMAL: string;
  setSelectedQuestion: (value: React.SetStateAction<Quiz>) => void;
  setVisble: (value: React.SetStateAction<boolean>) => void;
  setShowDeleteConfirmation: (value: React.SetStateAction<boolean>) => void;
  setDeleteItem: (value: React.SetStateAction<Quiz>) => void;
}) => {
  return (
    <div>
      {questionList.length > 0 && panelStatus === NORMAL
        ? questionList.map((item, i) => {
            return (
              <div key={i} className="card mt-2 w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  {item.question}

                  <Button
                    title={"Edit"}
                    onClick={() => {
                      setSelectedQuestion(item);
                      setVisble(true);
                    }}
                  />
                  {!item.isFirst ? (
                    <Button
                      title={"Delete"}
                      onClick={() => {
                        // setSelectedQuestion(item);

                        setShowDeleteConfirmation(true);

                        setDeleteItem(item);
                      }}
                    />
                  ) : (
                    <FirstQuestionBadge />
                  )}
                </div>
              </div>
            );
          })
        : undefined}
    </div>
  );
};

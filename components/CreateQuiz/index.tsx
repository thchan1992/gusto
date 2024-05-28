"use client";
import Link from "next/link";
import React from "react";
import Button from "../Button";
import { useState, useEffect } from "react";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { addQuizList } from "@/lib/features/quizList/quizListSlice";
import { Quiz } from "@/lib/types/Quiz";
import data from "@/util/dummy.json";

interface CreateQuizProps {
  id: string;
}
const CreateQuiz: React.FC<CreateQuizProps> = ({ id }) => {
  const [loadedQuestions, setLoadedQuestions] = useState<Quiz[]>(data);
  const [panelStatus, setPanelStatus] = useState<string>("NORMAL");
  const [questionText, setQuestionText] = useState<string>("");
  const [answerText, setAnswerText] = useState<string>("");
  const [answerLink, setAnswerLink] = useState<string>("");
  const [optionList, setOptionList] = useState<
    {
      text: string;
      nextQuizId: string;
    }[]
  >([]);

  useEffect(() => {
    console.log(id, "troubeshoot id");
    console.log(loadedQuestions);
  }, [loadedQuestions, id]);

  const handleSaveQuestion = () => {
    console.log("saving question");
  };

  const Panel = () => {
    if (panelStatus === "NORMAL") {
      return (
        <>
          <Button
            title="Add a new Question"
            onClick={() => {
              setPanelStatus("SET_QUESTION");
            }}
          />
        </>
      );
    } else if (panelStatus === "SET_QUESTION") {
      return (
        <>
          <h1>{questionText}</h1>
          <Button
            title="Done"
            onClick={() => {
              setPanelStatus("NORMAL");
              handleSaveQuestion();
            }}
          />
          <input
            type="text"
            name="questionText"
            placeholder="question"
            className="mt-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
            value={questionText}
            onChange={(e) => {
              setQuestionText(e.target.value);
            }}
          />
          <Button
            title="Add an answer for this "
            onClick={() => {
              setPanelStatus("SET_ANSWER");
              handleSaveQuestion();
            }}
          />
          {/* <select
                        className="select select-bordered w-full max-w-xs"
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                      >
                        <option disabled>Link</option>
                        {loadedQuestions.map((item, i) => {
                          return <option key={i} value={item._id}>{item.question}</option>;
                        })}
                      </select> */}
        </>
      );
    } else {
      return (
        <>
          <h1>{questionText}</h1>
          {}
          <input
            type="text"
            name="answerText"
            placeholder="option"
            className="mt-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
            value={answerText}
            onChange={(e) => {
              setAnswerText(e.target.value);
            }}
          />
          <select
            className="select select-bordered w-full max-w-xs"
            value={answerText}
            onChange={(e) => setAnswerLink(e.target.value)}
          >
            <option disabled>Link</option>
            {loadedQuestions.map((item, i) => {
              return (
                <option key={i} value={item._id}>
                  {item.question}
                </option>
              );
            })}
          </select>
          <Button
            title={"Finish the option"}
            onClick={() => {
              setOptionList((prev) => [
                ...prev,
                { text: answerText, nextQuizId: answerLink },
              ]);
              setAnswerText("");
              setAnswerLink("");
              setPanelStatus("SET_QUESTION");
            }}
          />
        </>
      );
    }
  };

  return (
    <>
      <section
        id="createQuiz"
        className="overflow-hidden py-16 md:py-20 lg:py-28"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
              <div
                className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] px-8 py-11 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                data-wow-delay=".15s
              "
              >
                {/* button */}
                {Panel()}
                {/* textfield for answer */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateQuiz;

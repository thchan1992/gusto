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
  const [troubleShootTitle, setTroubleShootTitle] = useState("");
  // const [loadedQuestions, setLoadedQuestions] = useState<Quiz[]>(data);
  const [panelStatus, setPanelStatus] = useState<string>("NORMAL");
  const [questionText, setQuestionText] = useState<string>("");
  const [questionList, setQuestionList] = useState([]);
  const [answerText, setAnswerText] = useState<string>("");
  const [answerLink, setAnswerLink] = useState<string>("");
  const [quizId, setQuizId] = useState<string>("");
  const [optionList, setOptionList] = useState<
    {
      text: string;
      nextQuizId: string;
    }[]
  >([]);

  const NORMAL = "NORMAL";
  const SET_ANSWER = "SET_ANSWER";

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetch("/api/troubleshoot/get/" + id);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        console.log("response", response);
        const data = await response.json();
        console.log(data.data.troubleshoot.title, "data found");
        setTroubleShootTitle(data.data.troubleshoot.title);
        console.log(data.data.questions);
        setQuestionList(data.data.questions);
      } catch (error) {
        // setError(error.message);
      } finally {
        // setLoading(false);
      }
    };
    fetchTroubleShoots();
  }, [id]);

  // useEffect(()=>{setQuestionList(prev=>[...prev,])},[questionList])

  const handleSaveQuestion = () => {
    console.log("saving question");
  };

  const addQuestionAPI = async () => {
    const res = await fetch("/api/create_quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isFirst: true,
        title: questionText,
        troubleShootId: id,
      }),
    });

    const data = await res.json();
    // console.log(data.data);

    setQuestionList(data.data.questionList);
    setQuizId(data.data.newQuestion._id);
  };
  // const Panel = () => {
  //   if (panelStatus === "NORMAL") {
  //     return (
  //       <>
  //         <Button
  //           title="Add a new Question"
  //           onClick={() => {
  //             setPanelStatus("SET_QUESTION");
  //           }}
  //         />
  //       </>
  //     );
  //   } else if (panelStatus === "SET_QUESTION") {
  //     return (
  //       <>
  //         <h1>{questionText}</h1>

  //         <Button
  //           title="Done"
  //           onClick={() => {
  //             setPanelStatus("NORMAL");
  //             handleSaveQuestion();
  //           }}
  //         />
  //         <input
  //           type="text"
  //           name="questionText"
  //           placeholder="question"
  //           className="mt-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
  //           value={questionText}
  //           onChange={(e) => {
  //             setQuestionText(e.target.value);
  //           }}
  //         />
  //         <Button
  //           title="Add an answer for this "
  //           onClick={() => {
  //             setPanelStatus("SET_ANSWER");
  //             handleSaveQuestion();
  //           }}
  //         />
  //         {/* <select
  //                       className="select select-bordered w-full max-w-xs"
  //                       value={option}
  //                       onChange={(e) => setOption(e.target.value)}
  //                     >
  //                       <option disabled>Link</option>
  //                       {loadedQuestions.map((item, i) => {
  //                         return <option key={i} value={item._id}>{item.question}</option>;
  //                       })}
  //                     </select> */}
  //       </>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <h1>{questionText}</h1>

  //         <input
  //           type="text"
  //           name="answerText"
  //           placeholder="option"
  //           className="mt-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
  //           value={answerText}
  //           onChange={(e) => {
  //             setAnswerText(e.target.value);
  //           }}
  //         />
  //         <select
  //           className="select select-bordered w-full max-w-xs"
  //           value={answerText}
  //           onChange={(e) => setAnswerLink(e.target.value)}
  //         >
  //           <option disabled>Link</option>
  //           {loadedQuestions.map((item, i) => {
  //             return (
  //               <option key={i} value={item._id}>
  //                 {item.question}
  //               </option>
  //             );
  //           })}
  //         </select>
  //         <Button
  //           title={"Finish the option"}
  //           onClick={() => {
  //             setOptionList((prev) => [
  //               ...prev,
  //               { text: answerText, nextQuizId: answerLink },
  //             ]);
  //             setAnswerText("");
  //             setAnswerLink("");
  //             setPanelStatus("SET_QUESTION");
  //           }}
  //         />
  //       </>
  //     );
  //   }
  // };

  const addOptionAPI = async () => {
    const res = await fetch("/api/create_quiz/create_option", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizId: quizId,
        optionList: optionList,
      }),
    });

    const data = await res.json();
    // console.log(data.data);
    console.log(data, "Questio Liwt");

    setQuestionList(data.data.questionList);
  };

  const handleAddAnswer = async () => {
    switch (panelStatus) {
      case NORMAL: {
        setPanelStatus(SET_ANSWER);
        await addQuestionAPI();
        //send api request to link the question id to trouble shooting

        break;
      }
      case SET_ANSWER: {
        setPanelStatus(NORMAL);
        console.log(optionList);
        await addOptionAPI();
        //send optionList and question to API
        break;
      }
      default: {
        break;
      }
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
                <div className="border-2 rounded p-2">
                  <h1>{troubleShootTitle}</h1>
                </div>
                {/* New Question */}
                <div className="flex flex-row ">
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
                  <div className="mt-5 ml-1">
                    <Button
                      title={
                        panelStatus === "NORMAL" ? "Add an question" : "Done"
                      }
                      onClick={() => {
                        handleAddAnswer();

                        //call answer component to add an answer
                        // panelStatus === "NORMAL"
                        //   ? setPanelStatus("SET_ANSWER")
                        //   : setPanelStatus("NORMAL");
                      }}
                    />
                  </div>
                </div>
                {/* Question List */}
                {questionList.length > 0 && panelStatus === NORMAL
                  ? questionList.map((item, i) => {
                      return <div key={i}>{item.question}</div>;
                    })
                  : undefined}

                {optionList.map((item, i) => {
                  return (
                    <div key={i}>
                      {item.text} = {item.nextQuizId}
                    </div>
                  );
                })}

                {panelStatus === SET_ANSWER && (
                  <div className="flex flex-row">
                    <input
                      type="text"
                      name="answerText"
                      placeholder="Answer"
                      className="mt-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                      value={answerText}
                      onChange={(e) => {
                        setAnswerText(e.target.value);
                      }}
                    />
                    <Button
                      title="Add option"
                      onClick={() => {
                        setOptionList((prev) => [
                          ...prev,
                          { text: answerText, nextQuizId: answerLink },
                        ]);
                        //add more answer
                        setAnswerLink("");
                        setAnswerText("");
                      }}
                    />
                  </div>
                )}

                <select
                  className="select select-bordered w-full max-w-xs"
                  value={answerLink}
                  onChange={(e) => {
                    setAnswerLink(e.target.value);
                    console.log(e.target.value);
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

                {/* button */}
                {/* {Panel()} */}
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

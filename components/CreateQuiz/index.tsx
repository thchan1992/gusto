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
import Modal from "./Modal";
import { UploadForm } from "./S3UploadForm";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CheckoutButton from "../ShowQuestion/CheckoutButton";
interface CreateQuizProps {
  id: string;
}
const CreateQuiz: React.FC<CreateQuizProps> = ({ id }) => {
  const [troubleShootTitle, setTroubleShootTitle] = useState("");
  // const [loadedQuestions, setLoadedQuestions] = useState<Quiz[]>(data);
  const [panelStatus, setPanelStatus] = useState<string>("NORMAL");
  const [fileUrl, setFileUrl] = useState("");

  const handleFileUrlChange = (url: string) => {
    setFileUrl(url);
  };
  const [questionText, setQuestionText] = useState<string>("");
  const [questionList, setQuestionList] = useState<Quiz[]>([]);
  const [answerText, setAnswerText] = useState<string>("");
  const [answerLink, setAnswerLink] = useState<string>("");
  const [quizId, setQuizId] = useState<string>("");
  const [visible, setVisble] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Quiz | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [optionList, setOptionList] = useState<
    {
      text: string;
      nextQuizId: string;
    }[]
  >([]);
  const router = useRouter();
  const { signOut } = useAuth();
  const { isSignedIn } = useUser();
  useEffect(() => {
    const handleAuthorised = async () => {
      if (isSignedIn === false) {
        await signOut();
        router.push("/");
      }
    };
    handleAuthorised();
    console.log(isSignedIn);
  }, [isSignedIn, router, signOut]);

  const NORMAL = "NORMAL";
  const SET_ANSWER = "SET_ANSWER";

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetch("/api/troubleshoot/get/" + id);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        if (response.status === 401) {
          await signOut();
          router.push("/");
          return;
        }

        const data = await response.json();

        setToken(data.data.troubleshoot.token);

        setTroubleShootTitle(data.data.troubleshoot.title);

        setQuestionList(data.data.questions);
      } catch (error) {
        // setError(error.message);
      } finally {
        // setLoading(false);
      }
    };
    fetchTroubleShoots();
  }, [id, router, signOut]);

  const addQuestionAPI = async () => {
    const imageUrl = fileUrl === null ? "" : fileUrl;
    try {
      const res = await fetch("/api/create_quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFirst: true,
          title: questionText,
          troubleShootId: id,
          imageUrl: imageUrl,
        }),
      });

      if (res.status === 401) {
        console.log("create_Quiz: 401");
        await signOut();
        router.push("/");
        return;
      }

      const data = await res.json();

      if (data?.data?.questionList) {
        setQuestionList(data.data.questionList);
      } else {
        console.error("No questionList found in the response", data);
      }
      if (data?.data?.newQuestion?._id) {
        setQuizId(data.data.newQuestion._id);
      } else {
        console.error("No newQuestion ID found in the response");
      }

      setFileUrl(null);
    } catch (e) {
      alert(e);
      console.error("Error adding question:", e);
    }
  };

  const addOptionAPI = async () => {
    try {
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
      if (res.status === 401) {
        await signOut();
        router.push("/");
        return;
      }

      const data = await res.json();
      if (data?.data?.questionList) {
        setQuestionList(data.data.questionList);
      } else {
        console.error("No questionList found in the response");
      }
    } catch (e) {
      alert(e);
      console.error("Error adding options:", e);
    }
  };

  const updateQuestion = async () => {
    const res = await fetch("/api/update_quiz", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updatedQuestion: selectedQuestion,
      }),
    });
    if (res.status === 401) {
      await signOut();
      router.push("/");
      return;
    }

    const data = await res.json();

    alert(data.data);

    setQuestionList(data.data.questionList);
  };

  const checkIsFirstQuestion = (id: string): boolean => {
    // const question =  questionList.map((question, i )=>{if (question._id === id) {return question}});
    let question: Quiz;
    for (let i = 0; i < questionList.length; i++) {
      if (questionList[i]._id === id) {
        question = questionList[i];
      }
    }
    console.log(question.isFirst, " Is First");
    return question.isFirst;
  };
  const handleDeleteQuestion = async (item: Quiz) => {
    if (!checkIsFirstQuestion(item._id)) {
      const res = await fetch("/api/remove_quiz/" + item._id + "/" + id, {
        method: "DELETE",
      });
      if (res.status === 401) {
        await signOut();
        router.push("/");
        return;
      }

      const data = await res.json();
      console.log(data.data, "returned data");
      setQuestionList(data.data.questionList);
    } else {
      console.log("Cannot delete the first question");
    }
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
        setOptionList([]);
        setQuestionText("");
        setAnswerText("");
        setAnswerLink("");
        setPanelStatus(NORMAL);

        await addOptionAPI();
        //send optionList and question to API
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleDeleteTroubleshoot = async () => {
    const res = await fetch("/api/remove_troubleshoot/" + id, {
      method: "DELETE",
    });
    if (res.status === 401) {
      await signOut();
      router.push("/");
      return;
    }
    if (res.status === 200) {
      router.push("/create_troubleshoot");
    }
  };

  return (
    <>
      <section
        id="createQuiz"
        className="overflow-hidden py-16 md:py-20 lg:py-28"
      >
        <Modal
          questionList={questionList}
          title={"hello"}
          child="hello"
          question={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          visible={visible}
          onClose={() => {
            visible ? setVisble(false) : setVisble(true);
          }}
          onConfirm={() => {
            visible ? setVisble(false) : setVisble(true);
            //send api to update the question

            updateQuestion();
          }}
        />
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
                  <Button
                    title="Delete Troubleshoot"
                    onClick={() => {
                      handleDeleteTroubleshoot();
                    }}
                  />
                </div>

                {token === null && (
                  <div>
                    <CheckoutButton troubleshootId={id} />
                  </div>
                )}
                {/* New Question */}
                <div className="flex flex-row ">
                  {questionList.length < 10 || token !== null ? (
                    <>
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
                    </>
                  ) : (
                    <div>
                      {questionList.length} Please pay now to add more question
                      or, remove some question and refresh the page.
                    </div>
                  )}
                </div>
                <div className="mt-5 ml-1">
                  <Button
                    disabled={questionText === "" ? true : false}
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

                {/* Question List */}
                {questionList.length > 0 && panelStatus === NORMAL
                  ? questionList.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className="card w-96 bg-base-100 shadow-xl mt-2"
                        >
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
                                  handleDeleteQuestion(item);
                                }}
                              />
                            ) : (
                              <div>
                                This is the first Question, cannot be deleted
                              </div>
                            )}
                          </div>
                        </div>
                      );
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
                  <div>
                    <UploadForm onFileUrlChange={handleFileUrlChange} />
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
                    <select
                      className="select select-bordered w-full max-w-xs"
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
                )}

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

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
import { FirstQuestionBadge } from "./FirstQuestionBadge";
import arrow from "@/assets/arrow.png";
import Image from "next/image";
import ConfirmationModal from "./ConfirmationModal";
interface CreateQuizProps {
  id: string;
}
const CreateQuiz: React.FC<CreateQuizProps> = ({ id }) => {
  const [troubleShootTitle, setTroubleShootTitle] = useState("");
  // const [loadedQuestions, setLoadedQuestions] = useState<Quiz[]>(data);
  const [panelStatus, setPanelStatus] = useState<string>("NORMAL");
  const [fileUrl, setFileUrl] = useState("");

  const [deletedItem, setDeleteItem] = useState<Quiz | null>(null);

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

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
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
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);

  const NORMAL = "NORMAL";
  const SET_ANSWER = "SET_ANSWER";

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetch("/api/troubleshoot/get/" + id);
        if (!response.ok) {
          router.push("/error/" + response.status);
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

      if (!res.ok) {
        router.push("/error/" + res.status);
        throw new Error(`Error: ${res.statusText}`);
      }

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

      if (!res.ok) {
        router.push("/error/" + res.status);
        throw new Error(`Error: ${res.statusText}`);
      }
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

    if (!res.ok) {
      router.push("/error/" + res.status);
      throw new Error(`Error: ${res.statusText}`);
    }
    if (res.status === 401) {
      await signOut();
      router.push("/");
      return;
    }

    const data = await res.json();
    setQuestionList(data.data.questionList);

    setShowUpdateConfirmation(true);
  };

  const handleUpdateConfirm = () => {
    setShowUpdateConfirmation(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirmation(false);
    if (deletedItem === null) {
      handleDeleteTroubleshoot();
    } else {
      handleDeleteQuestion(deletedItem);
      setDeleteItem(null);
    }
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

      if (!res.ok) {
        router.push("/error/" + res.status);
        throw new Error(`Error: ${res.statusText}`);
      }
      if (res.status === 401) {
        await signOut();
        router.push("/");
        return;
      }

      const data = await res.json();
      console.log(data.data, "returned data");
      setQuestionList(data.data.questionList);
      setShowUpdateConfirmation(true);
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

    if (!res.ok) {
      router.push("/error/" + res.status);
      throw new Error(`Error: ${res.statusText}`);
    }
    if (res.status === 200) {
      router.push("/create_troubleshoot");
      setShowUpdateConfirmation(true);
    }
  };

  const convertQuestionId = (nextQuizId: string): string => {
    console.log;
    const res = questionList.filter((item) => {
      return item._id === nextQuizId;
    });
    try {
      return res[0].question;
    } catch (e) {
      return "";
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
          title={"Modify"}
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
        <div className="container ">
          <div className="-mx-4 flex flex-wrap ">
            <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
              <div
                className=" mb-12 rounded-md bg-primary/[3%] px-8 py-11 dark:bg-thirdColor sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                data-wow-delay=".15s
              "
              >
                <div className="flex flex-row rounded-lg border-2 border-primaryColor p-2">
                  <div className="flex-grow-[9]">
                    <h1 className="text-primaryColor font-bold flex justify-center items-center">
                      Title
                    </h1>
                    <h1 className="m-1 w-full text-center text-primaryColor bg-secondaryColor rounded-lg p-1">
                      {troubleShootTitle}
                    </h1>
                  </div>
                  <div className="flex-grow-[1] flex items-center justify-center  ml-2">
                    <button
                      className="btn btn-error"
                      onClick={() => {
                        setShowDeleteConfirmation(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {token === null && (
                  <div className="p-1">
                    <CheckoutButton troubleshootId={id} />
                  </div>
                )}
                {/* New Question */}

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
                        {questionList.length} Please pay now to add more
                        question or, remove some question and refresh the page.
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
                  {/* Question List */}
                  {questionList.length > 0 && panelStatus === NORMAL
                    ? questionList.map((item, i) => {
                        return (
                          <div
                            key={i}
                            className="card mt-2 w-96 bg-base-100 shadow-xl"
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
                  {panelStatus === SET_ANSWER && (
                    <>
                      <h1 className="mt-2 font-bold text-black">
                        Image for the question
                      </h1>
                      <UploadForm onFileUrlChange={handleFileUrlChange} />
                      <div className="w-full rounded-md border-2 border-primaryColor p-1">
                        <h1 className="mt-2 font-bold text-black">
                          Question title
                        </h1>
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
                      </div>{" "}
                    </>
                  )}
                </div>
                {optionList.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="mt-3 rounded-lg border-2 border-primaryColor bg-primaryColor p-5 shadow-xl  hover:border-fourthColor"
                    >
                      <div className="mb-1 mt-1 text-pretty rounded-lg border-2 border-secondaryColor text-center">
                        <div className="rounded-t-lg bg-secondaryColor">
                          <h1 className="text-center font-bold text-primaryColor">
                            Answer {i + 1}
                          </h1>
                        </div>
                        <div className="p-1">{item.text}</div>
                      </div>
                      {convertQuestionId(item.nextQuizId) !== "" && (
                        <>
                          <div className="flex items-center justify-center">
                            <div className="m-1 flex items-center justify-center rounded-lg border-2 bg-secondaryColor p-1">
                              <h2 className=" font-bold text-black">
                                is linked to
                              </h2>
                              <Image
                                src={arrow}
                                width={50}
                                height={50}
                                alt="Question Media"
                              />
                            </div>
                          </div>
                          <div className="mb-1 mt-1 text-pretty rounded-lg border-2 border-secondaryColor text-center">
                            <div className="rounded-t-lg bg-secondaryColor">
                              <h1 className="text-center font-bold text-primaryColor">
                                Question
                              </h1>
                            </div>
                            {convertQuestionId(item.nextQuizId)}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                {/* button */}
                {/* {Panel()} */}
                {/* textfield for answer */}
                <ConfirmationModal
                  message={"Changes have been made."}
                  visible={showUpdateConfirmation}
                  onConfirm={handleUpdateConfirm}
                  // modalType="information"
                  modalType="information"
                />
                <ConfirmationModal
                  message={"Are you sure you want to delete this?"}
                  visible={showDeleteConfirmation}
                  onConfirm={handleDeleteConfirm}
                  onClose={handleDeleteCancel}
                  // modalType="information"
                  modalType="warning"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateQuiz;

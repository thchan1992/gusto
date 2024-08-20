"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Quiz } from "@/lib/types/Quiz";
import Modal from "./Modal";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CheckoutButton from "../ShowQuestion/CheckoutButton";
import ConfirmationModal from "./ConfirmationModal";
import {
  createOptionApi,
  createQuizApi,
  fetchOneTroubleShootApi,
  removeQuizApi,
  removeTroubleShootApi,
  updateQuestionApi,
} from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import { QuestionForm } from "./QuestionForm";
import { QuestionList } from "./QuestionList";
import { ModifyOption } from "./ModifyOption";
import { OptionsList } from "./OptionsList";
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
  const { handleApiErrors } = useHandleApiErrors();
  useEffect(() => {
    if (isSignedIn === false) {
      signOut().then(() => router.push("/"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);

  const NORMAL = "NORMAL";
  const SET_ANSWER = "SET_ANSWER";

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetchOneTroubleShootApi(id);
        const isSuccess = await handleApiErrors(response);
        if (!isSuccess) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addQuestionAPI = async () => {
    const imageUrl = fileUrl === null ? "" : fileUrl;
    try {
      const response = await createQuizApi(true, questionText, id, imageUrl);
      const isSuccess = await handleApiErrors(response);
      if (!isSuccess) return;
      const data = await response.json();
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
      router.push(`/error/500`);
    }
  };

  const addOptionAPI = async () => {
    try {
      const response = await createOptionApi(quizId, optionList);
      const isSuccess = await handleApiErrors(response);
      if (!isSuccess) return;

      const data = await response.json();
      if (data?.data?.questionList) {
        setQuestionList(data.data.questionList);
      } else {
        console.error("No questionList found in the response");
      }
    } catch (e) {
      router.push(`/error/500`);
    }
  };

  const updateQuestion = async () => {
    const response = await updateQuestionApi(selectedQuestion);
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;

    const data = await response.json();
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
      const response = await removeQuizApi(item._id, id);
      const isSuccess = await handleApiErrors(response);
      if (!isSuccess) return;
      const data = await response.json();
      setQuestionList(data.data.questionList);
      setShowUpdateConfirmation(true);
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
    const response = await removeTroubleShootApi(id);
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    if (isSuccess) {
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

                <QuestionForm
                  questionList={questionList}
                  token={token}
                  questionText={questionText}
                  setQuestionText={setQuestionText}
                  handleAddAnswer={handleAddAnswer}
                  panelStatus={panelStatus}
                />
                <QuestionList
                  questionList={questionList}
                  panelStatus={panelStatus}
                  NORMAL={NORMAL}
                  setSelectedQuestion={setSelectedQuestion}
                  setVisble={setVisble}
                  setShowDeleteConfirmation={setShowDeleteConfirmation}
                  setDeleteItem={setDeleteItem}
                />
                <ModifyOption
                  panelStatus={panelStatus}
                  SET_ANSWER={SET_ANSWER}
                  handleFileUrlChange={handleFileUrlChange}
                  answerText={answerText}
                  setAnswerText={setAnswerText}
                  setOptionList={setOptionList}
                  answerLink={answerLink}
                  setAnswerLink={setAnswerLink}
                  questionList={questionList}
                />
                <OptionsList
                  optionList={optionList}
                  convertQuestionId={convertQuestionId}
                />
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

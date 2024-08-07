import { Quiz } from "@/lib/types/Quiz";
import { useRef, useEffect, useState } from "react";
import Button from "../Button";
import { UploadForm } from "./S3UploadForm";
import Image from "next/image";
import divider from "@/assets/divider.png";
import arrow from "@/assets/arrow.png";
interface ModalProps {
  title: string;
  child: any;
  visible: boolean;
  question: Quiz;
  onClose: () => void;
  onConfirm: () => void;
  setSelectedQuestion: React.Dispatch<React.SetStateAction<Quiz>>;
  questionList: Quiz[];
}

function Modal({
  title,
  child,
  visible,
  onClose,
  question,
  onConfirm,
  setSelectedQuestion,
  questionList,
}: ModalProps) {
  const modalRef = useRef(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileUrlChange = (url: string) => {
    setFileUrl(url);
    updateQuestionField("imageUrl", url);
  };
  const [answerText, setAnswerText] = useState<string>("");
  const [answerLink, setAnswerLink] = useState<string>("");
  // const [allowSetIsFirst, setAllowSetIsFirst] = useState<boolean>(false);
  // const [optionList, setOptionList] = useState<
  //   {
  //     text: string;
  //     nextQuizId: string;
  //   }[]
  // >([]);

  useEffect(() => {
    console.log("selected question", question);
    if (!modalRef.current) {
      return;
    }
    visible ? modalRef.current.showModal() : modalRef.current.close();
  }, [visible, question]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleESC = (event) => {
    event.preventDefault();
    handleClose();
  };

  const updateQuestionField = (field: keyof Quiz, value: any) => {
    if (question) {
      setSelectedQuestion({
        ...question,
        [field]: value,
      });
    }
  };

  const showAnswerLinkName = (id: string) => {
    const questionToFind = questionList.find((question) => question._id === id);

    if (questionToFind !== undefined) {
      return questionToFind.question;
    } else {
      return "undefined";
    }
  };

  const updateOptionField = (
    index: number,
    field: keyof Quiz["options"][number],
    value: any
  ) => {
    if (question) {
      const updatedOptions = question.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      );
      setSelectedQuestion({
        ...question,
        options: updatedOptions,
      });
    }
  };

  const checkDuplicateOption = () => {
    let res = false;
    question.options.forEach((item) => {
      if (item.text === answerText) {
        res = true;
      }
    });
    return res;
  };

  const addOption = () => {
    if (checkDuplicateOption() === true) {
      alert("Same option has been inserted.");
      return;
    } else {
      if (answerText.trim()) {
        const newOption = { text: answerText, nextQuizId: answerLink };
        const updatedOptions = [...question.options, newOption];
        setSelectedQuestion({
          ...question,
          options: updatedOptions,
        });
        setAnswerText("");
        setAnswerLink("");
      }
    }
  };

  const handleToggleChange = (e) => {
    setSelectedQuestion({
      ...question,
      isFirst: e.target.checked,
    });
  };

  const onDeleteAnswer = (text: string) => {
    const updatedOptions = question.options.filter(
      (option) => option.text !== text
    );
    setSelectedQuestion({
      ...question,
      options: updatedOptions,
    });
  };

  const onDeleteLink = (index: number) => {
    updateOptionField(index, "nextQuizId", null);
  };

  return (
    <dialog
      ref={modalRef}
      id="my_modal_1"
      className="modal"
      onCancel={handleESC}
    >
      <form
        method="dialog"
        className="modal-box"
        onSubmit={(e) => e.preventDefault()}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        {question ? (
          <>
            <div className="card card-compact mb-1 mt-1 w-full border-2 border-primaryColor bg-primaryColor shadow-xl hover:border-fourthColor">
              {question.imageUrl !== "" ? (
                <figure>
                  <Image
                    src={question.imageUrl}
                    width={500}
                    height={500}
                    alt="Question Media"
                  />
                </figure>
              ) : (
                <div className="flex items-center justify-center p-5">
                  <h1>No Media</h1>
                </div>
              )}
              <div className="card-body">
                <h2 className="card-title">Question Media</h2>
                <p>
                  Upload a picture to add a new media or replace the current
                  media.
                </p>
                <div className="card-actions justify-end">
                  <UploadForm
                    onFileUrlChange={handleFileUrlChange}
                    oldFileUrl={question.imageUrl}
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-lg border-2 border-primaryColor bg-primaryColor p-5 shadow-xl  hover:border-fourthColor">
              <h1>Question Title</h1>
              <input
                type="text"
                name="questionText"
                placeholder="question"
                className="m-1 mb-5 mt-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                value={question.question}
                onChange={(e) => {
                  updateQuestionField("question", e.target.value);
                }}
              />
            </div>

            <div>
              {/* Need to add answer removal */}
              {question.options.map((item, i) => {
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
                      <div className="flex items-center justify-center p-1">
                        <input
                          type="text"
                          name={`optionText${i}`}
                          placeholder="Option text"
                          className="m-1 w-full rounded-md border border-transparent px-4 py-2 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                          value={item.text}
                          onChange={(e) => {
                            updateOptionField(i, "text", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="m-1 flex items-center justify-center rounded-lg border-2 bg-secondaryColor p-1">
                        <h2 className=" font-bold text-black">is linked to</h2>
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
                      {item.nextQuizId
                        ? showAnswerLinkName(item.nextQuizId)
                        : "No question"}

                      <div className="m-1 flex flex-row items-center justify-center">
                        <select
                          className="select select-bordered m-1 w-full"
                          value={item.nextQuizId || ""}
                          onChange={(e) => {
                            const newVal =
                              e.target.value !== "" ? e.target.value : null;
                            updateOptionField(i, "nextQuizId", newVal);
                          }}
                        >
                          <option value="" disabled>
                            Question
                          </option>
                          {questionList.map((questionItem, j) => {
                            return (
                              <option key={j} value={questionItem._id}>
                                {questionItem.question}
                              </option>
                            );
                          })}
                        </select>
                        {item.nextQuizId !== null && (
                          <button
                            className="btn"
                            onClick={() => onDeleteLink(i)}
                          >
                            Remove Link
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="m-5 flex items-center justify-center rounded-lg border-2 bg-white p-1">
                        <button
                          className="btn btn-outline btn-error"
                          onClick={() => {
                            onDeleteAnswer(item.text);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 rounded-lg border-2 border-primaryColor bg-primaryColor p-5 shadow-xl  hover:border-fourthColor">
              New answer
              <div className="m-1 flex flex-row items-center justify-center">
                <input
                  type="text"
                  name="answerText"
                  placeholder="Option"
                  className="w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                  value={answerText}
                  onChange={(e) => {
                    setAnswerText(e.target.value);
                  }}
                />
                <div className="ml-1 py-4">
                  <button
                    className="btn btn-primary btn-active"
                    onClick={() => {
                      // setOptionList((prev) => [
                      //   ...prev,
                      //   { text: answerText, nextQuizId: answerLink },
                      // ]);
                      addOption();

                      //add more answer
                      setAnswerLink("");
                      setAnswerText("");
                    }}
                  >
                    new option
                  </button>
                </div>
                {/* <Button title="Add option" /> */}
              </div>
              <select
                className="select select-bordered m-1 w-full"
                value={answerLink || ""}
                onChange={(e) => {
                  setAnswerLink(e.target.value);
                }}
              >
                <option value="" disabled>
                  Answer
                </option>
                {questionList.map((questionItem, j) => {
                  return (
                    <option key={j} value={questionItem._id}>
                      {questionItem.question}
                    </option>
                  );
                })}
              </select>
            </div>

            {!question.isFirst ? (
              <div className="m-1 w-full">
                <div className="form-control w-52 ">
                  <label className="label cursor-pointer">
                    <span className="label-text">First Question</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={question.isFirst}
                      onChange={handleToggleChange}
                      disabled={question.isFirst ? true : false}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="group relative">
                  <div className="hover:bg-yellow-600 badge badge-warning mt-3 gap-2 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-4 w-4 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    First question cannot be removed.
                  </div>
                  {/* <div className="absolute right-full top-1/2 transform -translate-y-1/2 ml-1 hidden w-32 p-2 m-2 bg-gray-800 text-red text-sm rounded-md group-hover:block">
                                    First question cannot be removed.
                                  </div> */}
                </div>
              </div>
            )}
          </>
        ) : (
          <p>Loading</p>
        )}

        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn" onClick={handleClose}>
            Close
          </button>
          <button className="btn" onClick={handleConfirm}>
            Confirm Change
          </button>
        </div>
      </form>
    </dialog>
  );
}
export default Modal;

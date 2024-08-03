import { Quiz } from "@/lib/types/Quiz";
import { useRef, useEffect, useState } from "react";
import Button from "../Button";
import { UploadForm } from "./S3UploadForm";
import Image from "next/image";

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
  const [allowSetIsFirst, setAllowSetIsFirst] = useState<boolean>(false);
  const [optionList, setOptionList] = useState<
    {
      text: string;
      nextQuizId: string;
    }[]
  >([]);

  useEffect(() => {
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

  const addOption = () => {
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
  };

  const handleToggleChange = (e) => {
    setSelectedQuestion({
      ...question,
      isFirst: e.target.checked,
    });
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
        <h3 className="font-bold text-lg">{title}</h3>
        {question ? (
          <>
            <div className="card card-compact bg-primaryColor w-full shadow-xl mb-1 mt-1 border-2 border-primaryColor hover:border-fourthColor">
              <figure>
                <Image
                  src={question.imageUrl}
                  width={500}
                  height={500}
                  alt="Question Media"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Question Media</h2>
                <p>Upload a picture to replace the current media.</p>
                <div className="card-actions justify-end">
                  <UploadForm
                    onFileUrlChange={handleFileUrlChange}
                    oldFileUrl={question.imageUrl}
                  />
                </div>
              </div>
            </div>

            {/* <div className="border-2 m-1">
              <Image
                src={question.imageUrl}
                width={500}
                height={500}
                alt="Question Media"
              />
              <UploadForm
                onFileUrlChange={handleFileUrlChange}
                oldFileUrl={question.imageUrl}
              />
            </div> */}
            <div className="border-2 shadow-xl rounded-lg p-5 mt-2 border-primaryColor hover:border-fourthColor  bg-primaryColor">
              <h1>Question Title</h1>
              <input
                type="text"
                name="questionText"
                placeholder="question"
                className="mt-5 mb-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp m-1"
                value={question.question}
                onChange={(e) => {
                  updateQuestionField("question", e.target.value);
                }}
              />
            </div>

            <div className="border-2 shadow-xl rounded-lg p-5 mt-2 border-primaryColor hover:border-fourthColor  bg-primaryColor">
              <h1>Answer</h1>
              {/* Need to add answer removal */}
              {question.options.map((item, i) => {
                return (
                  <div key={i}>
                    - {item.text} is linked to{" "}
                    {showAnswerLinkName(item.nextQuizId)}
                    <input
                      type="text"
                      name={`optionText${i}`}
                      placeholder="Option text"
                      className="w-full rounded-md border border-transparent px-4 py-2 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp m-1"
                      value={item.text}
                      onChange={(e) => {
                        updateOptionField(i, "text", e.target.value);
                      }}
                    />
                    <select
                      className="select select-bordered w-full m-1"
                      value={item.nextQuizId || ""}
                      onChange={(e) => {
                        const newVal =
                          e.target.value !== "" ? e.target.value : null;
                        updateOptionField(i, "nextQuizId", newVal);
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
                );
              })}
            </div>

            <div className="border-2 shadow-xl rounded-lg p-5 mt-2 border-primaryColor hover:border-fourthColor  bg-primaryColor">
              New answer
              <div className="m-1 flex flex-row justify-center items-center">
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
                <div className="py-4 ml-1">
                  <button
                    className="btn btn-active btn-primary"
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
                className="select select-bordered w-full m-1"
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
              <div className="w-full m-1">
                <div className="form-control w-52 ">
                  <label className="cursor-pointer label">
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
                <div className="relative group">
                  <div className="badge badge-warning gap-2 mt-3 hover:bg-yellow-600 hover:text-white">
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

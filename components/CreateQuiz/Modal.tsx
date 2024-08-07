import { Quiz } from "@/lib/types/Quiz";
import { useRef, useEffect, useState } from "react";
import Button from "../Button";
import { UploadForm } from "./S3UploadForm";
import Image from "next/image";
import divider from "@/assets/divider.png";
import arrow from "@/assets/arrow.png";
import ConfirmationModal from "./ConfirmationModal"; // Import the ConfirmationModal

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
  const modalRef = useRef<HTMLDialogElement>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationAction, setConfirmationAction] = useState<() => void>(
    () => {}
  );

  const handleFileUrlChange = (url: string) => {
    setFileUrl(url);
    updateQuestionField("imageUrl", url);
  };
  const [answerText, setAnswerText] = useState<string>("");
  const [answerLink, setAnswerLink] = useState<string>("");

  useEffect(() => {
    if (modalRef.current) {
      visible ? modalRef.current.showModal() : modalRef.current.close();
    }
  }, [visible, question]);

  const handleClose = () => {
    setConfirmationMessage("Are you sure you want to close without saving?");
    setConfirmationAction(() => onClose);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setConfirmationMessage("Are you sure you want to confirm the changes?");
    setConfirmationAction(() => onConfirm);
    setShowConfirmation(true);
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

    return questionToFind ? questionToFind.question : "undefined";
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
    return question.options.some((item) => item.text === answerText);
  };

  const addOption = () => {
    if (checkDuplicateOption()) {
      alert("Same option has been inserted.");
    } else if (answerText.trim()) {
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

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const handleConfirmationConfirm = () => {
    setShowConfirmation(false);
    confirmationAction();
  };

  return (
    <>
      <dialog ref={modalRef} id="my_modal_1" className="modal">
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

              <div className="mt-2 rounded-lg border-2 border-primaryColor bg-primaryColor p-5 shadow-xl hover:border-fourthColor">
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
                {question.options.map((item, i) => (
                  <div
                    key={i}
                    className="mt-3 rounded-lg border-2 border-primaryColor bg-primaryColor p-5 shadow-xl hover:border-fourthColor"
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
                        <h2 className="font-bold text-black">is linked to</h2>
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
                          {questionList.map((questionItem, j) => (
                            <option key={j} value={questionItem._id}>
                              {questionItem.question}
                            </option>
                          ))}
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
                ))}
              </div>

              <div className="mt-2 rounded-lg border-2 border-primaryColor bg-primaryColor p-5 shadow-xl hover:border-fourthColor">
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
                      onClick={addOption}
                    >
                      new option
                    </button>
                  </div>
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
                  {questionList.map((questionItem, j) => (
                    <option key={j} value={questionItem._id}>
                      {questionItem.question}
                    </option>
                  ))}
                </select>
              </div>

              {!question.isFirst ? (
                <div className="m-1 w-full">
                  <div className="form-control w-52">
                    <label className="label cursor-pointer">
                      <span className="label-text">First Question</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={question.isFirst}
                        onChange={handleToggleChange}
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
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>Loading</p>
          )}

          <div className="modal-action">
            <button className="btn" onClick={handleClose}>
              Close
            </button>
            <button className="btn" onClick={handleConfirm}>
              Confirm Change
            </button>
          </div>
        </form>
      </dialog>

      <ConfirmationModal
        message={confirmationMessage}
        visible={showConfirmation}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirmationConfirm}
      />
    </>
  );
}
export default Modal;

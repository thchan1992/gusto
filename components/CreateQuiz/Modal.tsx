import { Quiz } from "@/lib/types/Quiz";
import { useRef, useEffect, useState } from "react";
import Button from "../Button";

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
            <h1>Question</h1>
            <input
              type="text"
              name="questionText"
              placeholder="question"
              className="mt-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
              value={question.question}
              onChange={(e) => {
                updateQuestionField("question", e.target.value);
              }}
            />
            <h1>Answer</h1>
            {question.options.map((item, i) => {
              return (
                <div key={i}>
                  {item.text} is linked to {showAnswerLinkName(item.nextQuizId)}
                  <input
                    type="text"
                    name={`optionText${i}`}
                    placeholder="Option text"
                    className="w-full rounded-md border border-transparent px-4 py-2 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                    value={item.text}
                    onChange={(e) => {
                      updateOptionField(i, "text", e.target.value);
                    }}
                  />
                  <select
                    className="select select-bordered w-full max-w-xs"
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
                // setOptionList((prev) => [
                //   ...prev,
                //   { text: answerText, nextQuizId: answerLink },
                // ]);
                addOption();

                //add more answer
                setAnswerLink("");
                setAnswerText("");
              }}
            />
            <select
              className="select select-bordered w-full max-w-xs"
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
            {!question.isFirst ? (
              <div className="form-control w-52">
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
            ) : (
              <div>this is a first question</div>
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

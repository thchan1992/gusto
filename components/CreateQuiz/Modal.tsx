import { Quiz } from "@/lib/types/Quiz";
import { useRef, useEffect } from "react";

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
  return (
    <dialog
      ref={modalRef}
      id="my_modal_1"
      className="modal"
      onCancel={handleESC}
    >
      <form method="dialog" className="modal-box">
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
                      updateOptionField(i, "nextQuizId", e.target.value);
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

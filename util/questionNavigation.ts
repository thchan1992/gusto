import { Quiz } from "@/lib/types/Quiz";

export const findFirstQuestion = (questions: Quiz[]): Quiz => {
  const cur: Quiz = questions.find((item: Quiz) => item.isFirst === true);
  if (cur === undefined) {
    return questions[0];
  }
  return cur;
};

export const onRestart = (
  questions: Quiz[],
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Quiz | null>>,
  setHistory: React.Dispatch<React.SetStateAction<Quiz[]>>
): void => {
  const cur = findFirstQuestion(questions);
  setCurrentQuestion(cur);
  setHistory([]);
};

export const onBack = (
  history: Quiz[],
  setHistory: React.Dispatch<React.SetStateAction<Quiz[]>>,
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Quiz | null>>
): void => {
  if (history.length > 0) {
    const lastQuestion = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentQuestion(lastQuestion);
  }
};

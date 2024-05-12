export const getQuiz = async () => {
  try {
    const res = await fetch("/api/quiz");
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/lib/types/Quiz";
import {
  findFirstQuestion,
  onBack,
  onRestart,
} from "@/util/questionNavigation";
import { LoadingSpinner } from "../LoadingSpinner";
import { OptionsList } from "../ShowQuestion/OptionsList";
import { ImageDisplay } from "../ShowQuestion/ImageDisplay";
import { QuestionCard } from "../ShowQuestion/QuestionCard";
import { fetchOnePublicTroubleShootApi } from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";

const ShowQuestion = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Quiz | null>(null);
  const [history, setHistory] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [questionList, setQuestionList] = useState<Quiz[]>([]);
  const [troubleshootTitle, setTroubleShootTitle] = useState<string>("");

  const { handleApiErrors } = useHandleApiErrors();

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetchOnePublicTroubleShootApi(token);
        const isSuccess = await handleApiErrors(response);
        if (!isSuccess) return;
        const data = await response.json();
        setTroubleShootTitle(data.data.troubleshoot.title);
        setQuestionList(data.data.questions);
        const cur: Quiz = findFirstQuestion(data.data.questions);
        if (cur !== undefined) {
          setCurrentQuestion(cur);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTroubleShoots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <section
        id="createQuiz"
        className="overflow-hidden py-16 md:py-20 lg:py-28"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-7/12 xl:w-8/12 ">
              {currentQuestion !== undefined ? (
                <div
                  className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] px-8 py-11 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                  data-wow-delay=".15s"
                >
                  <div className="flex justify-between">
                    {history.length > 0 ? (
                      <button
                        className="btn btn-active btn-accent"
                        onClick={() =>
                          onBack(history, setHistory, setCurrentQuestion)
                        }
                      >
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}
                    <button
                      className="btn btn-active btn-secondary"
                      onClick={() =>
                        onRestart(questionList, setCurrentQuestion, setHistory)
                      }
                    >
                      Restart
                    </button>
                  </div>

                  <ImageDisplay imageUrl={currentQuestion.imageUrl} />
                  <div className="flex justify-center items-center flex-col">
                    {/* card */}
                    <QuestionCard currentQuestion={currentQuestion} />
                    <OptionsList
                      currentQuestion={currentQuestion}
                      questionList={questionList}
                      setHistory={setHistory}
                      setCurrentQuestion={setCurrentQuestion}
                    />
                  </div>
                </div>
              ) : (
                <div>This trouble shoot dose not have a first question</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShowQuestion;

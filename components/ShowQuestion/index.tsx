"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../Button";
import { Quiz } from "@/lib/types/Quiz";
import CheckoutButton from "./CheckoutButton";
import { TroubleShoot } from "@/lib/models/TroubleShoot";

const ShowQuestion = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Quiz | null>(null);
  const [history, setHistory] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [questionList, setQuestionList] = useState<Quiz[]>([]);
  const [shareLink, setShareLink] = useState("");
  const [troubleshootTitle, setTroubleShootTitle] = useState<string>("");
  const router = useRouter();

  const findFirstQuestion = (questions: Quiz[]): Quiz => {
    const cur: Quiz = questions.find((item: Quiz) => item.isFirst === true);

    return cur;
  };

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetch("/api/troubleshoot/get/" + id);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTroubleShootTitle(data.data.troubleshoot.title);
        setQuestionList(data.data.questions);
        console.log(data.data.troubleshoot);
        if (data.data.troubleshoot.isPublic) {
          setShareLink(
            "http://localhost:3000/shared/" + data.data.troubleshoot.token
          );
        }

        const cur: Quiz = findFirstQuestion(data.data.questions);

        if (cur === undefined) {
        } else {
          setCurrentQuestion(cur);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTroubleShoots();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const onShare = async () => {
    try {
      const res = await fetch("/api/make_troubleshoot_public/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ troubleshootId: id }),
      });

      const data = await res.json();
      console.log(data.url);
      setShareLink(data.url);
    } catch (e) {
      alert(e);
      console.error("Error adding question:", e);
    }
  };

  const onRestart = (): void => {
    const cur = findFirstQuestion(questionList);
    setCurrentQuestion(cur);
    setHistory([]);
  };

  const onBack = () => {
    if (history.length > 0) {
      const lastQuestion = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentQuestion(lastQuestion);
    }
  };

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
                        onClick={onBack}
                      >
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}
                    {shareLink === "" ? (
                      <>
                        <button
                          className="btn btn-active btn-secondary"
                          onClick={onShare}
                        >
                          Share
                        </button>
                        <CheckoutButton troubleshootId={id} />
                      </>
                    ) : (
                      <div></div>
                    )}
                    Link: {shareLink}
                    <button
                      className="btn btn-active btn-secondary"
                      onClick={onRestart}
                    >
                      Restart
                    </button>
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    {/* card */}
                    <div className="card w-full bg-base-100 shadow-xl p-1 m-4">
                      <div className="card-body">
                        <h2 className="card-title">Question!</h2>
                        <div className="card-actions justify-end">
                          <h1 className="break-words">
                            {currentQuestion.question} Lorem ipsum dolor sit
                            amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur. Excepteur sint occaecat cupidatat non
                            proident, sunt in culpa qui officia deserunt mollit
                            anim id est laborum.
                          </h1>
                        </div>
                      </div>
                    </div>

                    {currentQuestion.options.map((item, i) => {
                      return (
                        <div
                          onClick={() => {
                            if (item.nextQuizId !== undefined) {
                              const nextQuestion = questionList.find(
                                (quest: Quiz) => quest._id === item.nextQuizId
                              );

                              if (nextQuestion) {
                                setHistory((prev) => [
                                  ...prev,
                                  currentQuestion,
                                ]);
                                setCurrentQuestion(nextQuestion);
                              }
                            } else {
                              console.log("the end of the troubleshoot");
                            }
                          }}
                          key={i}
                          className="w-full bordered rounded-xl shadow-xl p-4 m-4 bg-base-200 hover:bg-base-300 cursor-pointer"
                        >
                          Option {i + 1}: {item.text} Lorem ipsum dolor sit
                          amet, consectetur adipiscing elit, sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua. Ut
                          enim ad minim veniam, quis nostrud exercitation
                          ullamco laboris nisi ut aliquip ex ea commodo
                          consequat. Duis aute irure dolor in reprehenderit in
                          voluptate velit esse cillum dolore eu fugiat nulla
                          pariatur. Excepteur sint occaecat cupidatat non
                          proident, sunt in culpa qui officia deserunt mollit
                          anim id est laborum.
                        </div>
                      );
                    })}
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

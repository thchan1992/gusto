"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../Button";
import { Quiz } from "@/lib/types/Quiz";
import CheckoutButton from "./CheckoutButton";
import { TroubleShoot } from "@/lib/models/TroubleShoot";
import { useUser, useAuth } from "@clerk/nextjs";
const ShowQuestion = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Quiz | null>(null);
  const [history, setHistory] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [questionList, setQuestionList] = useState<Quiz[]>([]);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [troubleshootTitle, setTroubleShootTitle] = useState<string>("");
  const router = useRouter();
  const { signOut } = useAuth();
  const { isSignedIn } = useUser();
  console.log(isSignedIn);
  useEffect(() => {
    const handleAuthorised = async () => {
      if (isSignedIn === false) {
        await signOut();
        router.push("/");
      }
    };
    handleAuthorised();
    console.log(isSignedIn);
  }, [isSignedIn, router, signOut]);

  const findFirstQuestion = (questions: Quiz[]): Quiz => {
    const cur: Quiz = questions.find((item: Quiz) => item.isFirst === true);
    if (cur === undefined) {
      return questions[0];
    }

    return cur;
  };

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetch("/api/troubleshoot/get/" + id);
        if (response.status === 401) {
          await signOut();
          router.push("/");
          return;
        }
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
  }, [id, router, signOut]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <>
      <section
        id="createQuiz"
        className="overflow-hidden py-16 md:py-20 lg:py-28 bg-gradient-to-b from-primaryColor to-fifthColor"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-7/12 xl:w-8/12 ">
              {currentQuestion !== undefined || currentQuestion !== null ? (
                <div
                  className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] px-8 py-11 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                  data-wow-delay=".15s"
                >
                  <div className="flex justify-between">
                    {shareLink === "" ? (
                      <div className="p-1">
                        <CheckoutButton troubleshootId={id} />
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {shareLink !== "" && (
                      <div className="border-2 rounded-md bg-secondaryColor flex justify-center items-center mr-1">
                        <h1 className=" text-primaryColor p-1 font-bold">
                          Link: {shareLink}
                        </h1>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <button
                        className="btn btn-active btn-secondary"
                        onClick={onRestart}
                      >
                        Restart
                      </button>
                      {shareLink !== "" && (
                        <button
                          onClick={() => {
                            copyText(shareLink);
                            setCopied(true);
                          }}
                          className="btn btn-accent m-1"
                        >
                          {copied ? (
                            <>
                              Copied
                              <svg
                                className="w-3 h-3 text-white me-1.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 16 12"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M1 5.917 5.724 10.5 15 1.5"
                                />
                              </svg>
                            </>
                          ) : (
                            "Copy Link"
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn btn-active btn-accent mt-2"
                    onClick={onBack}
                    disabled={history.length > 0 ? false : true}
                  >
                    Back
                  </button>

                  <div className="flex justify-center items-center flex-col">
                    {/* card */}
                    <div className="card w-full bg-base-100 shadow-xl p-1 m-4">
                      {currentQuestion !== null ? (
                        <div className="card-body">
                          <h2 className="card-title">Question</h2>
                          <div className="card-actions justify-end">
                            <h1 className="break-words">
                              {currentQuestion.question}
                            </h1>
                          </div>
                        </div>
                      ) : (
                        <div className="card-body">
                          <h2 className="card-title">
                            This troubleshooter has no Question
                          </h2>
                          <div className="card-actions justify-end"></div>
                        </div>
                      )}
                    </div>

                    {currentQuestion !== null &&
                      currentQuestion.options.map((item, i) => {
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
                            className="w-full bordered rounded-xl shadow-xl p-4 m-4 bg-base-200 hover:bg-base-300 cursor-pointer hover:border-thirdColor"
                          >
                            Option {i + 1}: {item.text}
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

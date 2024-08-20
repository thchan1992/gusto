"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/lib/types/Quiz";
import CheckoutButton from "./CheckoutButton";
import { useUser, useAuth } from "@clerk/nextjs";
import { fetchOneTroubleShootApi } from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import { ImageDisplay } from "./ImageDisplay";
import { QuestionCard } from "./QuestionCard";
import { OptionsList } from "./OptionsList";
import {
  findFirstQuestion,
  onBack,
  onRestart,
} from "@/util/questionNavigation";
import { LoadingSpinner } from "../LoadingSpinner";

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
  const { handleApiErrors } = useHandleApiErrors();

  useEffect(() => {
    if (isSignedIn === false) {
      signOut().then(() => router.push("/"));
    }
  }, [isSignedIn, router, signOut]);

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetchOneTroubleShootApi(id);
        const isSuccess = await handleApiErrors(response);
        if (!isSuccess) return;
        const data = await response.json();
        setTroubleShootTitle(data.data.troubleshoot.title);
        setQuestionList(data.data.questions);
        if (data.data.troubleshoot.isPublic) {
          setShareLink(
            "https://troubleshush.com/shared/" + data.data.troubleshoot.token
          );
          // setShareLink(
          //   process.env.NEXT_PUBLIC_URL + data.data.troubleshoot.token
          // );
        }
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
          {troubleshootTitle}
          <div className="-mx-4 flex flex-wrap">
            {currentQuestion !== null ? (
              <div className="w-full px-4 lg:w-7/12 xl:w-8/12 ">
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
                        onClick={() =>
                          onRestart(
                            questionList,
                            setCurrentQuestion,
                            setHistory
                          )
                        }
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

                  <ImageDisplay imageUrl={currentQuestion.imageUrl} />
                  <button
                    className="btn btn-active btn-accent mt-2"
                    onClick={() =>
                      onBack(history, setHistory, setCurrentQuestion)
                    }
                    disabled={history.length > 0 ? false : true}
                  >
                    Back
                  </button>

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
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <h2 className="font-bold">
                  This trouble-shush has no question.
                </h2>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShowQuestion;

"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "../Button";
import { Quiz } from "@/lib/types/Quiz";

const ShowQuestion = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Quiz | null>(null);
  const [error, setError] = useState(null);
  const [questionList, setQuestionList] = useState([]);
  const [troubleshootTitle, setTroubleShootTitle] = useState<string>("");
  const router = useRouter();

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

        const cur: Quiz = data.data.questions.find(
          (item: Quiz) => item.isFirst === true
        );

        setCurrentQuestion(cur);
      } catch (error) {
        // setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTroubleShoots();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <section
        id="createQuiz"
        className="overflow-hidden py-16 md:py-20 lg:py-28 "
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-7/12 xl:w-8/12 ">
              <div className="flex flex-row justify-between ">
                {/* <input
                  type="text"
                  name="questionText"
                  placeholder="Title for troubleshoot"
                  className="mt-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                  value={troubleshootTitle}
                  onChange={(e) => {
                    setTroubleShootTitle(e.target.value);
                  }}
                /> */}
              </div>
              x
              {currentQuestion !== null && (
                <div
                  className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] px-8 py-11 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                  data-wow-delay=".15s
              "
                >
                  {currentQuestion.question}
                  {currentQuestion.options.map((item, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (item.nextQuizId !== undefined) {
                            const nextQuestion = questionList.find(
                              (quest: Quiz) => {
                                return quest._id === item.nextQuizId;
                              }
                            );
                            setCurrentQuestion(nextQuestion);
                          } else {
                            console.log("the end of the troubleshoot");
                          }
                        }}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShowQuestion;

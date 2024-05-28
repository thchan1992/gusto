"use client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Button from "../Button";

const Quiz = () => {
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && !userId) {
      redirect("/signin");
    }
  }, [isLoaded, userId]);

  useEffect(() => {
    if (!isLoaded && userId) {
    }
  }, [isLoaded, userId]);

  if (!isLoaded) {
    return (
      <div className="w-full px-4">
        <div className="mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
          Loading
        </div>
      </div>
    );
  } else {
    return (
      <section id="quiz" className="overflow-hidden py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <Link href={"/create_quiz"}>
              <Button title="Create a new Quiz" onClick={() => {}} />
            </Link>
            <div className="w-full px-4">
              <div className="mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"></div>
            </div>
            <div className="w-full px-4 lg:w-5/12 xl:w-4/12"></div>
          </div>
        </div>
      </section>
    );
  }
};
export default Quiz;

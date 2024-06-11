import Breadcrumb from "@/components/Common/Breadcrumb";
import Quiz from "@/components/Quiz";
import { useAuth, useEmailLink } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React from "react";

const QuizPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Quiz"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />
      <Quiz />
    </>
  );
};

export default QuizPage;

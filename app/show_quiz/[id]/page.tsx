import Breadcrumb from "@/components/Common/Breadcrumb";
import CreateQuiz from "@/components/CreateQuiz";
import ShowQuiz from "@/components/ShowQuiz";

import React from "react";

const ShowQuizPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  return (
    <>
      <Breadcrumb
        pageName="Show Quiz"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />
      <ShowQuiz id={id} />
    </>
  );
};

export default ShowQuizPage;

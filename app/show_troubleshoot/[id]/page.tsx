import Breadcrumb from "@/components/Common/Breadcrumb";
import CreateQuiz from "@/components/CreateQuiz";
import ShowQuestion from "@/components/ShowQuestion";
import React from "react";

const ShowQuestionPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  return (
    <>
      <Breadcrumb
        pageName="Create A Quiz"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />
      {/* <CreateQuiz id={id} /> */}
      <ShowQuestion id={id} />
    </>
  );
};

export default ShowQuestionPage;

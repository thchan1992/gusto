import Breadcrumb from "@/components/Common/Breadcrumb";
import CreateQuiz from "@/components/CreateQuiz";
import React from "react";

const CreateQuizPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  return (
    <>
      <Breadcrumb
        pageName="Add or modify your questions/steps"
        description="Add a new question/step by inserting the title, or modify any exisitng question/step by pressing edit."
      />
      <div className="bg-gradient-to-b from-primaryColor to-fifthColor">
        <CreateQuiz id={id} />
      </div>
    </>
  );
};

export default CreateQuizPage;

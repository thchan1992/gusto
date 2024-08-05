import Breadcrumb from "@/components/Common/Breadcrumb";
import CreateQuiz from "@/components/CreateQuiz";
import ShowQuestion from "@/components/ShowQuestion";
import React from "react";

const ShowQuestionPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  return (
    <>
      <Breadcrumb
        pageName="Preview trouble-shush"
        description="Preview your trouble-shush manual. You can also share it by copying the link."
      />
      {/* <CreateQuiz id={id} /> */}
      <ShowQuestion id={id} />
    </>
  );
};

export default ShowQuestionPage;

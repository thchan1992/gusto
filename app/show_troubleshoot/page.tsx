import Breadcrumb from "@/components/Common/Breadcrumb";
import CreateQuiz from "@/components/CreateQuiz";
import ShowTroubleShoots from "@/components/ShowTroubleShoots";

import React from "react";

const ShowTroubleShootsPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  return (
    <>
      <Breadcrumb
        pageName="Show Quiz"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />
      <ShowTroubleShoots />
    </>
  );
};

export default ShowTroubleShootsPage;

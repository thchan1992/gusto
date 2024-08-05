import Breadcrumb from "@/components/Common/Breadcrumb";
import CreateQuiz from "@/components/CreateQuiz";
import ShowTroubleShoots from "@/components/ShowTroubleShoots";

import React from "react";

const ShowTroubleShootsPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  return (
    <>
      <Breadcrumb
        pageName="Preview trouble-shush"
        description="Preview your trouble-shush manual. You can also share it by copying the link."
      />
      <div className="bg-gradient-to-b from-primaryColor to-fifthColor">
        <ShowTroubleShoots />
      </div>
    </>
  );
};

export default ShowTroubleShootsPage;

import Breadcrumb from "@/components/Common/Breadcrumb";
import SharedTroubleshoot from "@/components/Shared";
import React from "react";

const SharedPage = ({ params }: { params: { token: string } }) => {
  const token = params.token;
  return (
    <>
      <Breadcrumb
        pageName="Trouble Shoot"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />
      <SharedTroubleshoot token={token} />
    </>
  );
};

export default SharedPage;

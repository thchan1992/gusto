import Breadcrumb from "@/components/Common/Breadcrumb";
import SharedTroubleshoot from "@/components/Shared";
import React from "react";

const SharedPage = ({ params }: { params: { token: string } }) => {
  const token = params.token;
  return (
    <>
      <Breadcrumb pageName="Trouble Shoot" description="" />
      <SharedTroubleshoot token={token} />
    </>
  );
};

export default SharedPage;

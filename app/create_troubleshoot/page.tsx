import Breadcrumb from "@/components/Common/Breadcrumb";

import CreateTroubleShoot from "@/components/CreateTroubleShoot";
import React from "react";

const CreateTroubleShootPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Modify Troubleshush"
        description="Create a troubleshush manual by giving a title, or modify your exisiting manual."
      />
      <CreateTroubleShoot />
    </>
  );
};

export default CreateTroubleShootPage;

import Breadcrumb from "@/components/Common/Breadcrumb";

import CreateTroubleShoot from "@/components/CreateTroubleShoot";
import React from "react";

const CreateTroubleShootPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Create A TroubleShoot"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius eros eget sapien consectetur ultrices. Ut quis dapibus libero."
      />
      <CreateTroubleShoot />
    </>
  );
};

export default CreateTroubleShootPage;

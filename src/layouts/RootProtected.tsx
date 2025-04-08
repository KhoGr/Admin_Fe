import React from "react";
import AuthChecker from "../components/shared/AuthChecker";
import FullLayout from "../layouts/full/FullLayout";

const RootProtected: React.FC = () => {
  return (
    <AuthChecker>
      <FullLayout />
    </AuthChecker>
  );
};

export default RootProtected;

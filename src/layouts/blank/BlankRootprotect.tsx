import React from "react";
import AuthChecker from "../../components/shared/AuthChecker";
import BlankLayout from "./BlankLayout";
const RootProtected: React.FC = () => {
  return (
    <AuthChecker>
      <BlankLayout />
    </AuthChecker>
  );
};

export default RootProtected;

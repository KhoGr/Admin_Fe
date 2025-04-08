import React, { FC } from "react";
import { Navigate } from "react-router-dom";

const ProtectedLogin: FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export default ProtectedLogin;

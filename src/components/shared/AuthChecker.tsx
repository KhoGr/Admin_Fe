
///////////////


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../redux/slices/auth.slice";
import { RootState, AppDispatch } from "../../redux/store";

const AuthChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const tokenExpires = localStorage.getItem("tokenExpires");

      if (storedToken && tokenExpires) {
        const expiresAt = new Date(tokenExpires).getTime();
        const now = Date.now();

        if (now >= expiresAt) {
          console.warn("Token đã hết hạn");
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpires");
          navigate("/account/login");
          return;
        }

        try {
          await dispatch(getMe()).unwrap();
        } catch (error) {
          console.error("Lỗi xác thực:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpires");
          navigate("/account/login");
        }
      } else {
        navigate("/account/login");
      }
    };

    checkAuth();
  }, [dispatch, navigate, token]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthChecker;
//


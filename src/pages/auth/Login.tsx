import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { postLoginRequest } from "../../types/User";
import { loginAdmin, getMe, logout } from "../../redux/slices/auth.slice";
import { useNavigate } from "react-router-dom";
import { setMessage } from "../../redux/slices/message.slice"; // ✅ import
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token, user, error, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        dispatch(setMessage({ type: "success", message: "Đăng nhập thành công!" })); // ✅ success message
        navigate("/dashboard");
      } else {
        dispatch(logout());
        dispatch(setMessage({ type: "error", message: "Chỉ tài khoản admin mới được phép truy cập!" })); // ✅ role error
      }
    }
  }, [user, dispatch, navigate]);

  const handleLogin = async (data: postLoginRequest) => {
    try {
      const resultAction = await dispatch(loginAdmin(data)).unwrap();

      if (resultAction?.token) {
        await dispatch(getMe()).unwrap();
      }
    } catch (err) {
      dispatch(setMessage({ type: "error", message: "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu." })); // ✅ login error
      console.error("Đăng nhập thất bại:", err);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        onForgotPasswordClick={handleForgotPassword}
      />
    </div>
  );
};

export default Login;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { postLoginRequest } from "../../types/User";
import { loginUser } from "../../redux/slices/auth.slice";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { Alert } from "antd";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token, error, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/"); // Nếu đã đăng nhập, chuyển hướng về trang chủ ngay
    }
  }, [token, navigate]);

  const handleLogin = (data: postLoginRequest) => {
    dispatch(loginUser(data));
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Điều hướng đến trang quên mật khẩu
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Đăng nhập</h2>

        {error && <Alert message={error} type="error" className="mb-4" showIcon />}

        <LoginForm onSubmit={handleLogin} loading={loading} error={error} onForgotPasswordClick={handleForgotPassword} />
      </div>
    </div>
  );
};

export default Login;

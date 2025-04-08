import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { registerUser } from "../../redux/slices/auth.slice";
import { RegisterLocalRequest } from "../../types/User";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import RegisterForm from "../../components/auth/RegisterForm";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, error, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLoginClick = () => {
    navigate("/account/login");
  };
 
  const handleRegister = (data: RegisterLocalRequest) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (user) {
      alert("Đăng ký thành công! Vui lòng vào Gmail để xác nhận.");
      navigate("/account/login");
    }
  }, [user, navigate]);

  return (
    <RegisterForm
      onSubmit={handleRegister}
      loading={loading}
      error={error}
      onLoginClick={handleLoginClick}
    />
  );
};

export default Register;

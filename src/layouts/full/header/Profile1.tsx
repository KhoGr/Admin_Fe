import { Button, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/auth.slice";
import user1 from "/src/assets/images/profile/user-1.jpg";
import { RootState } from "../../../redux/store"; 

const ProfileForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/account/login"); 
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        menu={{
          items: [
            {
              key: "profile",
              label: (
                <Link to="/account/profile">
                  <UserOutlined /> Hồ sơ của tôi
                </Link>
              ),
            },
            {
              key: "logout",
              label: (
                <Button type="text" danger onClick={handleLogout} icon={<LogoutOutlined />}>
                  Đăng xuất
                </Button>
              ),
            },
          ],
        }}
      >
        <span className="cursor-pointer flex items-center gap-2">
          <img src={user1} alt="Avatar" className="rounded-full w-10 h-10" />
          <span>Xin chào, {user?.name || "Người dùng"}</span>
        </span>
      </Dropdown>
    </div>
  );
};

export default ProfileForm;

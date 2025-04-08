import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../redux/slices/auth.slice";
import { RootState, AppDispatch } from "../../redux/store";
import { Upload, Form, Input, Button, Card, Avatar, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const EditProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();// gọi action redux
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {// ảnh hg
    if (user) {
      form.setFieldsValue({
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        address: user.address,
      });
      setAvatar(user.avatar || null);
    }
  }, [user, form]);

  const handleUpdate = async (values: any) => {
    try {
      await userApi.updateUserProfile({ ...values, avatar });
      message.success("Cập nhật thông tin thành công!");
      dispatch(getMe());
      navigate("/account/profile"); 
    } catch (error: any) {
      message.error(error.response?.data?.message || "Cập nhật thất bại, thử lại!");
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await userApi.updateAvatar(formData);
      if (response.status === 200) {
        message.success("Cập nhật ảnh đại diện thành công!");
        setAvatar(response.data.newSrc);
        dispatch(getMe());
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Cập nhật ảnh đại diện thất bại!");
    }
    setUploading(false);
  };

  return (
    <Card style={{ maxWidth: 600, margin: "auto", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Chỉnh Sửa Hồ Sơ</h2>
      
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <ImgCrop>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
          >
            <Avatar size={100} src={avatar} style={{ border: "3px solid #1890ff", cursor: "pointer" }} />
            <Button icon={<UploadOutlined />} loading={uploading} style={{ display: "block", margin: "10px auto" }}>
              Thay đổi ảnh
            </Button>
          </Upload>
        </ImgCrop>
      </div>

      {/* Form Chỉnh Sửa Thông Tin */}
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item label="Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Email không hợp lệ!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Cập Nhật
        </Button>
      </Form>
    </Card>
  );
};

export default EditProfileForm;

import { Form, Input, Button, Alert } from "antd";
import { RegisterLocalRequest } from "../../types/User";

interface RegisterFormProps {
  onSubmit: (data: RegisterLocalRequest) => void;
  loading: boolean;
  error: string | null;
  onLoginClick: () => void;

}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, error }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: RegisterLocalRequest) => {
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-700">Đăng ký</h2>

      {error && <Alert message={error} type="error" className="mb-4" showIcon />}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input placeholder="Nguyễn Đức Hoàng" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="abc@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={loading}>
          Đăng ký
        </Button>
      </Form>
    </div>
  );
};

export default RegisterForm;

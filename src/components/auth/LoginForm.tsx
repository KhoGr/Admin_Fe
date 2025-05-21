import { Form, Input, Button, Alert, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { postLoginRequest } from '../../types/User';

const { Title } = Typography;

interface LoginFormProps {
  onSubmit: (data: postLoginRequest) => void;
  loading: boolean;
  error: string | null;
  onForgotPasswordClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: postLoginRequest) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Card
      title={
        <Title level={3} className="text-center mb-0 text-black dark:text-white">
          Đăng nhập Quản trị
        </Title>
      }
      className="w-full max-w-md mx-auto"
      bordered={false}
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 12 }}
    >
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            placeholder="admin@example.com"
            autoComplete="email"
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
          ]}
        >
          <Input.Password
            placeholder="••••••••"
            autoComplete="current-password"
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginForm;

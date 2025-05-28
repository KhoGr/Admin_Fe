// components/AddResponseTab.tsx
import React from "react";
import { Form, Input, Button, Select, Typography } from "antd";

const { Title } = Typography;
const { TextArea } = Input;
interface AddResponseTabProps {
  onAdd: (newResponse: { id: string; keyword: string; response: string; category: string }) => void;
}

const AddResponseTab: React.FC<AddResponseTabProps> = ({ onAdd }) => {
  const [form] = Form.useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = (values: any) => {
    console.log("New Response Submitted:", values);
  };

  return (
    <div>
      <Title level={4}>Add New Response</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Trigger"
          name="trigger"
          rules={[{ required: true, message: "Please enter a trigger phrase" }]}
        >
          <Input placeholder="e.g. hello, hi there" />
        </Form.Item>

        <Form.Item
          label="Response"
          name="response"
          rules={[{ required: true, message: "Please enter a response message" }]}
        >
          <TextArea rows={4} placeholder="Bot's response..." />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category">
            <Select.Option value="greeting">Greeting</Select.Option>
            <Select.Option value="farewell">Farewell</Select.Option>
            <Select.Option value="info">Information</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Response
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddResponseTab;

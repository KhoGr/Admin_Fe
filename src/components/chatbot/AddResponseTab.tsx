import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Typography, message } from "antd";
import {
  ChatbotResponse,
  CreateChatbotResponseDTO,
  UpdateChatbotResponseDTO,
} from "../../types/chatbotResponse";
import { AIModel } from "../../types/aiModel";
import { MenuItem } from "../../types/menuItem";
import menuItemApi from "../../api/menuItemApi"; // 👈 Import API gọi menu items

const { Title } = Typography;
const { TextArea } = Input;

interface AddResponseTabProps {
  onSubmit: (
    data: CreateChatbotResponseDTO | UpdateChatbotResponseDTO,
    isUpdate: boolean
  ) => Promise<void>;
  initialData?: ChatbotResponse | null;
  isLoading?: boolean;
  aiModels: AIModel[];
}

const AddResponseTab: React.FC<AddResponseTabProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  aiModels,
}) => {
  const [form] = Form.useForm();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        keyword: initialData.keyword,
        response: initialData.response,
        category: initialData.category,
        ai_model_id: initialData.ai_model_id,
        item_id: initialData.menu_item?.item_id,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await menuItemApi.getAll();
        setMenuItems(response.data);
      } catch (error) {
        console.error("Lỗi khi tải menu items:", error);
        message.error("Không thể tải danh sách món ăn.");
      }
    };

    fetchMenuItems();
  }, []);

  const handleFinish = async (
    values: CreateChatbotResponseDTO | UpdateChatbotResponseDTO
  ) => {
    const isUpdate = !!initialData?.response_id;
    try {
      await onSubmit(values, isUpdate);
      if (!isUpdate) {
        form.resetFields();
      }
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
    }
  };

  return (
    <div>
      <Title level={4}>
        {initialData ? "Cập nhật phản hồi" : "Thêm phản hồi mới"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Từ khóa (Trigger)"
          name="keyword"
          rules={[{ required: true, message: "Nhập từ khóa kích hoạt" }]}
        >
          <Input placeholder="e.g. xin chào, món ăn nào ngon" />
        </Form.Item>

        <Form.Item
          label="Phản hồi"
          name="response"
          rules={[{ required: true, message: "Nhập nội dung phản hồi" }]}
        >
          <TextArea rows={4} placeholder="Nội dung bot sẽ trả lời..." />
        </Form.Item>

        <Form.Item label="Phân loại" name="category">
          <Select placeholder="Chọn phân loại">
            <Select.Option value="greeting">Greeting</Select.Option>
            <Select.Option value="farewell">Farewell</Select.Option>
            <Select.Option value="info">Information</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="AI Model"
          name="ai_model_id"
          rules={[{ required: true, message: "Chọn AI model" }]}
        >
          <Select placeholder="Chọn AI model">
            {aiModels.map((model) => (
              <Select.Option key={model.id} value={model.id}>
                {model.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Món ăn liên kết" name="item_id">
          <Select
            showSearch
            allowClear
            placeholder="Chọn món ăn (nếu có)"
            optionFilterProp="children"
          >
            {menuItems.map((item) => (
              <Select.Option key={item.item_id} value={item.item_id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {initialData ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddResponseTab;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Input, Select, Button, Rate, message } from "antd";
import { mockMenuItems } from "../../mock/mocks";
import { useEffect, useState } from "react";
import commentApi from "../../api/commentApi";
import {
  Comment,
  CommentResponse,
  CreateCommentPayload,
  UpdateCommentPayload,
} from "../../types/comment";

const { TextArea } = Input;

const formSchema = z.object({
  menuItemId: z.string().min(1, "Menu item is required"),
  userName: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.coerce.number().min(1).max(5),
  content: z.string().min(5, "Comment must be at least 5 characters"),
});

type FormValues = z.infer<typeof formSchema>;


interface CommentFormProps {
  initialData?: any;
  onSave: (data: CreateCommentPayload | UpdateCommentPayload) => Promise<void>;
  onSuccess: () => void;
  onCancel?: () => void;
  preselectedMenuItemId?: string;
}
export function CommentForm({
  initialData,
  onSuccess,
  onCancel,
  preselectedMenuItemId,
}: CommentFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        menuItemId: initialData.menuItemId,
        userName: initialData.userName,
        rating: initialData.rating,
        content: initialData.content,
      });
    } else {
      form.setFieldsValue({
        menuItemId: preselectedMenuItemId || "",
        userName: "",
        rating: 5,
        content: "",
      });
    }
  }, [initialData, preselectedMenuItemId, form]);

  const handleFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      if (initialData) {
        await commentApi.update(initialData.id, values);
        message.success("Cập nhật bình luận thành công!");
      } else {
        await commentApi.create({
          ...values,
          userId: "1", // TODO: Replace with actual user id
        });
        message.success("Thêm bình luận thành công!");
      }
      onSuccess();
    } catch (err) {
      message.error("Lỗi khi lưu bình luận");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Món ăn"
        name="menuItemId"
        rules={[{ required: true, message: "Menu item is required" }]}
      >
        <Select disabled={!!preselectedMenuItemId} placeholder="Chọn món ăn">
          {mockMenuItems.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Tên người dùng"
        name="userName"
        rules={[{ required: true, min: 2, message: "Name must be at least 2 characters" }]}
      >
        <Input placeholder="Nguyễn Văn A" />
      </Form.Item>

      <Form.Item
        label="Đánh giá"
        name="rating"
        rules={[{ required: true, type: "number", min: 1, max: 5 }]}
      >
        <Rate />
      </Form.Item>

      <Form.Item
        label="Bình luận"
        name="content"
        rules={[{ required: true, min: 5, message: "Bình luận phải ít nhất 5 ký tự" }]}
      >
        <TextArea rows={4} placeholder="Chia sẻ cảm nhận của bạn về món ăn..." />
      </Form.Item>

      <Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialData ? "Cập nhật" : "Thêm"} bình luận
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

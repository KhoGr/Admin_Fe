import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Input, Select, Button, Rate, message } from "antd";
import { mockMenuItems } from "../../mock/mocks";
import { useEffect } from "react";

const { TextArea } = Input;

const formSchema = z.object({
  menuItemId: z.string().min(1, "Menu item is required"),
  userName: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  content: z.string().min(5, "Comment must be at least 5 characters"),
});

interface Comment {
  id: string;
  menuItemId: string;
  menuItemName: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: Date;
}

type CommentFormProps = {
  initialData: Comment | null;
  onSave: (data: Comment) => void;
  onCancel: () => void;
  preselectedMenuItemId?: string;
};

export function CommentForm({
  initialData,
  onSave,
  onCancel,
  preselectedMenuItemId,
}: CommentFormProps) {
  const [form] = Form.useForm();

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

  const handleFinish = (values: z.infer<typeof formSchema>) => {
    const selectedMenuItem = mockMenuItems.find(m => m.id === values.menuItemId);

    const comment: Comment = {
      id: initialData?.id || `c${Math.random().toString(36).substring(2, 9)}`,
      menuItemId: values.menuItemId,
      menuItemName: selectedMenuItem?.name || "",
      userName: values.userName,
      rating: values.rating,
      content: values.content,
      createdAt: initialData?.createdAt || new Date(),
    };

    onSave(comment);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Menu Item"
        name="menuItemId"
        rules={[{ required: true, message: "Menu item is required" }]}
      >
        <Select disabled={!!preselectedMenuItemId} placeholder="Select menu item">
          {mockMenuItems.map(item => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="User Name"
        name="userName"
        rules={[{ required: true, min: 2, message: "Name must be at least 2 characters" }]}
      >
        <Input placeholder="John Smith" />
      </Form.Item>

      <Form.Item
        label="Rating"
        name="rating"
        rules={[{ required: true, type: "number", min: 1, max: 5, message: "Rating must be between 1 and 5" }]}
      >
        <Rate />
      </Form.Item>

      <Form.Item
        label="Comment"
        name="content"
        rules={[{ required: true, min: 5, message: "Comment must be at least 5 characters" }]}
      >
        <TextArea rows={4} placeholder="Share your thoughts on this menu item..." />
      </Form.Item>

      <Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialData ? "Update" : "Add"} Comment
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

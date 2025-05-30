import { useEffect, useState } from "react";
import { Form, Input, Select, Button, Rate, message } from "antd";
import commentApi from "../../api/commentApi";
import {
  CreateCommentPayload,
  UpdateCommentPayload,
} from "../../types/comment";
import { z } from "zod";
import menuItemApi from "../../api/menuItemApi";
import customerApi from "../../api/customerApi";
import { CustomerModel } from "../../types/Customer";

const { TextArea } = Input;
const { Option } = Select;

const formSchema = z.object({
  menuItemId: z.string().min(1, "Menu item is required"),
  userId: z.string().min(1, "Customer is required"),
  userName: z.string().min(1, "Customer name is required"),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
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
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [customers, setCustomers] = useState<CustomerModel[]>([]);

  // Fetch menu items and customers
  useEffect(() => {
    fetchMenuItems();
    fetchCustomers();
  }, []);

  // Fetch Menu Items
  const fetchMenuItems = async () => {
    try {
      const res = await menuItemApi.getAll();
      setMenuItems(res.data);
    } catch (error) {
      message.error("Không thể tải danh sách món ăn");
    }
  };

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const res = await customerApi.getAll();
      setCustomers(res.data);
    } catch (error) {
      message.error("Không thể tải danh sách khách hàng");
    }
  };

  // Set fields when initialData or preselectedMenuItemId changes
  useEffect(() => {
    if (initialData && customers.length > 0 && menuItems.length > 0) {
      form.setFieldsValue({
        menuItemId: String(initialData.item_id), // match with form field
        userId: String(initialData.customer_id), // match with form field
        userName: initialData.user_name,          // match with form field
        rating: initialData.rating,
        comment: initialData.comment,            // match with form field
      });
    } else {
      form.setFieldsValue({
        menuItemId: preselectedMenuItemId || "",
        rating: 5,
        comment: "",
      });
    }
  }, [initialData, customers, menuItems, form]);

  // Handle customer change to populate userName
  const handleCustomerChange = (userId: string) => {
    const customer = customers.find((c) => String(c.customer_id) === userId);
    if (customer) {
      form.setFieldsValue({
        userName: customer.user_info?.name,
      });
    }
  };

  // Handle form submission
  const handleFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      const payload = {
        item_id: parseInt(values.menuItemId),
        customer_id: parseInt(values.userId),
        user_name: values.userName,
        rating: values.rating,
        comment: values.comment,
      };

      if (initialData) {
        await commentApi.update(initialData.comment_id, payload);
        message.success("Cập nhật bình luận thành công!");
      } else {
        await commentApi.create(payload);
        message.success("Thêm bình luận thành công!");
      }
      onSuccess();
    } catch (err) {
      console.error("❌ Error submitting comment:", err);
      message.error("Lỗi khi lưu bình luận");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish} autoComplete="off">
      <Form.Item
        label="Món ăn"
        name="menuItemId"
        rules={[{ required: true, message: "Vui lòng chọn món ăn" }]}
      >
        <Select disabled={!!preselectedMenuItemId} placeholder="Chọn món ăn">
          {menuItems.map((item) => (
            <Option key={item.item_id} value={String(item.item_id)}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Khách hàng"
        name="userId"
        rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}
      >
        <Select placeholder="Chọn khách hàng" onChange={handleCustomerChange}>
          {customers.map((customer) => (
            <Option key={customer.customer_id} value={String(customer.customer_id)}>
              {customer.user_info?.name} ({customer.user_info?.account?.email})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="userName" hidden>
        <Input />
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
        name="comment"
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

import { useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
  Divider,
  message,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import orderApi from '../../api/orderApi';
import { OrderModel } from '../../types/Orderlist';

type Props = {
  initialData?: Partial<OrderModel>;
  onSave: () => void; // chỉ cần báo đã lưu xong để gọi getAll bên ngoài
  onCancel: () => void;
};

const OrderForm = ({ initialData, onSave, onCancel }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        customerName: initialData.customer?.name,
        tableNumber: initialData.table?.table_id?.toString(),
        notes: initialData.note,
        items:
          initialData.order_items?.map((item) => ({
            item_id: item.item_id,
            name: item.menu_item?.name,
            quantity: item.quantity,
            price: Number(item.price),
          })) || [],
      });
    }
  }, [initialData, form]);

  const handleFinish = async (values: any) => {
    const order_items = (values.items || []).map((item: any) => ({
      item_id: item.item_id || 0, // 👈 bạn nên thay bằng ID thực từ menu
      quantity: item.quantity,
      price: item.price,
    }));

    const payload = {
      customer_id: undefined, // 👈 nếu có chọn khách thì set vào đây
      table_id: values.tableNumber ? parseInt(values.tableNumber) : undefined,
      order_type: values.tableNumber ? 'dine-in' as const : 'take-away' as const,
      discount_amount: 0,
      payment_method: 'cash',
      note: values.notes,
      order_items,
    };

    try {
      await orderApi.create(payload);
      message.success('Đơn hàng đã được tạo');
      onSave(); // thông báo đã lưu xong, để cha gọi getAll
      form.resetFields();
    } catch (err) {
      console.error('Tạo đơn hàng thất bại:', err);
      message.error('Tạo đơn hàng thất bại');
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Typography.Title level={4}>
        {initialData ? 'Edit Order' : 'New Order'}
      </Typography.Title>

      <Form.Item
        label="Customer Name"
        name="customerName"
        rules={[{ required: true, message: 'Please enter customer name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Table Number" name="tableNumber">
        <Input placeholder="Leave blank for takeaway" />
      </Form.Item>

      <Form.Item label="Notes" name="notes">
        <Input.TextArea rows={2} />
      </Form.Item>

      <Divider />
      <Typography.Title level={5}>Items</Typography.Title>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align="baseline"
                wrap
              >
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Item name required' }]}
                >
                  <Input placeholder="Item name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'quantity']}
                  rules={[{ required: true, message: 'Qty' }]}
                >
                  <InputNumber placeholder="Qty" min={1} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'price']}
                  rules={[{ required: true, message: 'Price' }]}
                >
                  <InputNumber placeholder="Price" min={0} step={0.1} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Item
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider />
      <Form.Item>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save Order
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;

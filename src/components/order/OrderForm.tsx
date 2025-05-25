import { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Space, Typography, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Order } from '../../types/order';

type Props = {
  initialData?: Order;
  onSave: (order: Order) => void;
  onCancel: () => void;
};

const OrderForm = ({ initialData, onSave, onCancel }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        customerName: initialData.customerName,
        tableNumber: initialData.tableNumber,
        notes: initialData.notes,
        items: initialData.items,
      });
    }
  }, [initialData, form]);

  const calculateSubtotal = (quantity: number, price: number) =>
    quantity && price ? quantity * price : 0;

  const handleFinish = (values: any) => {
    const items = (values.items || []).map((item: any) => ({
      ...item,
      subtotal: calculateSubtotal(item.quantity, item.price),
      id: item.id || `item_${Date.now()}_${Math.random()}`,
    }));

    const total = items.reduce((sum: number, item: any) => sum + item.subtotal, 0);

    const newOrder: Order = {
      ...initialData,
      ...values,
      items,
      total,
      createdAt: initialData?.createdAt || new Date(),
      status: initialData?.status || 'pending',
      id: initialData?.id || `order_${Date.now()}`,
    };

    onSave(newOrder);
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

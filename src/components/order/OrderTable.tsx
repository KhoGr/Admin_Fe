import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form, Input, Select, InputNumber, Typography, Divider, Space, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Order, MenuItem, OrderItem } from '../../types/order';
import { mockMenuItems } from '../../mock/mocks';
import { log } from 'console';

const { TextArea } = Input;
const { Option } = Select;

const orderStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'canceled', label: 'Canceled' },
];

const formSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  tableNumber: z.string().optional(),
  status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'canceled']),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1, 'Please select a menu item'),
        quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
      }),
    )
    .min(1, 'Order must have at least one item'),
});

type OrderFormData = z.infer<typeof formSchema>;

type OrderFormProps = {
  initialData: Order | null;
  onSave: (data: Order) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void; // thêm để hỗ trợ xóa
};

export function OrderForm({ initialData, onSave, onCancel }: OrderFormProps) {
  const [total, setTotal] = useState(initialData?.total || 0);
  const [viewingItem, setViewingItem] = useState<MenuItem | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          customerName: initialData.customerName,
          tableNumber: initialData.tableNumber || '',
          status: initialData.status,
          notes: initialData.notes || '',
          items: initialData.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        }
      : {
          customerName: '',
          tableNumber: '',
          status: 'pending',
          notes: '',
          items: [{ menuItemId: '', quantity: 1 }],
        },
  });
  const [detailVisible, setDetailVisible] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');

  useEffect(() => {
    let newTotal = 0;
    items.forEach((item) => {
      const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId);
      if (menuItem) {
        newTotal += menuItem.price * item.quantity;
      }
    });
    setTotal(Number(newTotal.toFixed(2)));
  }, [items]);

  const onSubmit = (values: OrderFormData) => {
    const orderItems: OrderItem[] = values.items.map((item, index) => {
      const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)!;
      const subtotal = menuItem.price * item.quantity;

      return {
        id: initialData?.items[index]?.id || `oi${Math.random().toString(36).substring(2, 9)}`,
        menuItemId: item.menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        subtotal: Number(subtotal.toFixed(2)),
      };
    });

    const order: Order = {
      id: initialData?.id || `o${Math.random().toString(36).substring(2, 9)}`,
      customerName: values.customerName,
      tableNumber: values.tableNumber || undefined,
      status: values.status,
      notes: values.notes || undefined,
      items: orderItems,
      total,
      createdAt: initialData?.createdAt || new Date(),
    };

    onSave(order);
  };

  function onDelete(id: string): void {
    console.log('xoá');
  }

  return (
    <>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} autoComplete="off">
        <Form.Item
          label="Customer Name"
          validateStatus={errors.customerName ? 'error' : ''}
          help={errors.customerName?.message}
        >
          <Input {...register('customerName')} placeholder="John Doe" />
        </Form.Item>

        <Form.Item label="Table Number (Optional)">
          <Input {...register('tableNumber')} placeholder="12" />
        </Form.Item>

        <Form.Item
          label="Status"
          validateStatus={errors.status ? 'error' : ''}
          help={errors.status?.message}
        >
          <Select {...(register('status') as any)} defaultValue={initialData?.status || 'pending'}>
            {orderStatusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider>Order Items</Divider>
        {fields.map((field, index) => (
          <Space key={field.id} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
            <Form.Item
              label="Menu Item"
              validateStatus={errors.items?.[index]?.menuItemId ? 'error' : ''}
              help={errors.items?.[index]?.menuItemId?.message}
            >
              <Select
                {...register(`items.${index}.menuItemId` as const)}
                value={items[index].menuItemId}
                onChange={(value) => setValue(`items.${index}.menuItemId`, value)}
                style={{ width: 200 }}
                placeholder="Select item"
              >
                {mockMenuItems.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name} - ${item.price.toFixed(2)}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Quantity"
              validateStatus={errors.items?.[index]?.quantity ? 'error' : ''}
              help={errors.items?.[index]?.quantity?.message}
            >
              <InputNumber
                min={1}
                {...register(`items.${index}.quantity` as const)}
                value={items[index].quantity}
                onChange={(value) => setValue(`items.${index}.quantity`, Number(value))}
              />
            </Form.Item>

            <Button
              icon={<InfoCircleOutlined />}
              onClick={() => {
                const menuItem = mockMenuItems.find((mi) => mi.id === items[index].menuItemId);
                if (menuItem) setViewingItem(menuItem);
              }}
            >
              Chi tiết
            </Button>

            <Button
              danger
              icon={<MinusCircleOutlined />}
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            />
          </Space>
        ))}

        <Form.Item>
          <Button
            type="dashed"
            onClick={() => append({ menuItemId: '', quantity: 1 })}
            icon={<PlusOutlined />}
            block
          >
            Add Item
          </Button>
        </Form.Item>

        <Form.Item label="Notes (Optional)">
          <TextArea
            {...register('notes')}
            rows={3}
            placeholder="Special instructions or requests"
          />
        </Form.Item>

        <Divider />
        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>
          Total: ${total.toFixed(2)}
        </div>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {initialData ? 'Update' : 'Create'} Order
            </Button>
          </Space>
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            {initialData && (
              <>
                <Button type="default" onClick={() => setDetailVisible(true)}>
                  Chi tiết Order
                </Button>
                {onDelete && (
                  <Button danger onClick={() => onDelete(initialData.id)}>
                    Xoá
                  </Button>
                )}
              </>
            )}
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {initialData ? 'Update' : 'Create'} Order
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Modal Hiển thị chi tiết món */}
      <Form.Item style={{ textAlign: 'right' }}>
        <Space>
          {initialData && (
            <>
              <Button type="default" onClick={() => setDetailVisible(true)}>
                Chi tiết Order
              </Button>
              {onDelete && (
                <Button danger onClick={() => onDelete(initialData.id)}>
                  Xoá
                </Button>
              )}
            </>
          )}
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialData ? 'Update' : 'Create'} Order
          </Button>
        </Space>
      </Form.Item>
    </>
  );
}
